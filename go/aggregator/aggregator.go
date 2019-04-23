//restfull api for processing ansible deployment commands
package main

import (
	"bufio"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/ryanbressler/CloudForest"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"reflect"
	"strconv"
	"strings"
	"github.com/rs/cors"
)

var env = os.Getenv("ENV")

func main() {
	startListening()
}

func startListening() {
	r := mux.NewRouter()
	r.HandleFunc("/aggregate", aggregate)
	listenPort := ":80"
	if val := os.Getenv("HTTP_PLATFORM_PORT"); val != "" {
		listenPort = ":" + val
	}
	fmt.Printf("Listening on port %s\n", listenPort)
	handler := cors.Default().Handler(r)
	err := http.ListenAndServe(listenPort, handler)
	if err != nil {
		log.Fatal(err)
	}
}

type City struct {
	Name string
	CurrentPopulation int `AFM`
	Population1 int  `AFM`
	Population2 int  `AFM`
	ErrorMessage string
	Branches int `AFM`
	SuggestedBranches5yr int `AFM`
	SuggestedBranches10yr int `AFM`
}

func aggregate(w http.ResponseWriter, r *http.Request) {
	region := "none"
	if urlParams := r.URL.Query(); urlParams != nil {
		region = urlParams.Get("region")
		log.Printf("region: %s\n", region)
	}

	if region == "mock" {
		fixedResponse := loadFixedReponse()
		w.Header().Set("Content-Type", "application/json")
		w.Write(fixedResponse)
		return
	} else 	if region != "British Columbia" {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	log.Printf("Loading CSV")
	cities, errStr, err := loadCityCSV("citypopulations.csv")

	citiesJson, _ := json.Marshal(cities)
	log.Println(string(citiesJson))

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "%s\n", errStr)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(citiesJson)
}

func loadFixedReponse() []byte {
	data, err := ioutil.ReadFile("fixedresponse.json") // just pass the file name
	if err != nil {
		log.Printf("Errors: file not found")
	}
	return data
}

func processCity(city City) string {
	fmFile, _ := os.Create("test.fm")
	fmFile.WriteString("featureid\tcase1\n")
	fmFile.WriteString(fmt.Sprintf("N:CurrentPopulation\t%d\n", city.CurrentPopulation))
	fmFile.WriteString(fmt.Sprintf("N:Population1\t%d\n",city.Population1))
	fmFile.WriteString(fmt.Sprintf("N:Population2\t%d\n",city.Population2))
	fmFile.WriteString(fmt.Sprintf("N:Branches\t%d\n",city.Branches))
	fmFile.WriteString(fmt.Sprintf("N:SuggestedBranches5yr\t%d\n",city.SuggestedBranches5yr))
	fmFile.WriteString(fmt.Sprintf("N:SuggestedBranches10yr\t%d\n",city.SuggestedBranches10yr))
	fmFile.Close()
	return applyForest("test.fm")
}

func loadCityCSV(csvFileName string) ([]City, string, error) {
	csvFile, _ := os.Open(csvFileName)
	reader := csv.NewReader(bufio.NewReader(csvFile))
	var cities []City
	log.Printf("Found file.. reading..")
	reader.Read() //skip header
	for {
		line, error := reader.Read()
		if error == io.EOF {
			break
		} else if error != nil {
			log.Fatal(error)
		}
		city := City{
			Name: line[0],
		}
		city.Name = strings.TrimSpace(city.Name)
		pop, cerr := strconv.Atoi(line[1])
		if cerr != nil {
			return nil, "Failed to convert city population", cerr
		}
		city.CurrentPopulation = pop

		pop, cerr = strconv.Atoi(line[2])
		if cerr != nil {
			return nil, "Failed to convert city population", cerr
		}
		city.Population1 = pop

		pop, cerr = strconv.Atoi(line[3])
		if cerr != nil {
			return nil, "Failed to convert city population", cerr
		}
		city.Population2 = pop

		branches, errStr, err := getBranches(city)
		if err != nil {
			city.ErrorMessage = errStr
		}
		city.Branches = branches
		city.SuggestedBranches10yr = city.Population2 / 1325
		resp, _ := strconv.ParseFloat(processCity(city), 32)
		city.SuggestedBranches5yr = int(resp)
		cities = append(cities, city)
	}

	log.Printf("Done parsing cities..")
	return cities, "", nil
}


func getBranches(city City) (int, string, error) {
	log.Printf("Checking branches for city: %s -> len %d",city.Name,len(city.Name))

	url := "http://backend-l337disrupt.westus.azurecontainer.io/num-branches?city=" + url.PathEscape(city.Name)
	log.Printf("Requestings: %s", url)
	response, err := http.Get(url)
	respJson, _ := json.Marshal(response)
	log.Printf("Response is:  " + string(respJson))
	if err != nil {
		return 0, "Failed to find city.", err
	}

	responseData, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(string(responseData))

	branches, err := strconv.Atoi(string(responseData))
	if err != nil {
		return 0, "Branches not a valid number", err
	}
	return branches, "", nil
}

func afmTags(v reflect.StructField) bool {
	return v.Tag == "AFM"
}

// afmPrefix translates Go types into the prefixes CloudForest expects on the AFM header
func afmPrefix(k reflect.Kind) string {
	switch k {
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64, reflect.Uint, reflect.Uint8,
		reflect.Uint16, reflect.Uint32, reflect.Uint64, reflect.Float32, reflect.Float64, reflect.Complex64, reflect.Complex128:
		return "N"
	case reflect.Bool:
		return "B"
	case reflect.String:
		return "C"
	}
	return ""
}


func applyForest(afm string) string {
	//Parse Data
	data, err := CloudForest.LoadAFM(afm)
	if err != nil {
		log.Fatal(err)
	}

	forestfile, err := os.Open("forest.sf") // For read access.
	if err != nil {
		log.Fatal(err)
	}
	defer forestfile.Close()
	forestreader := CloudForest.NewForestReader(forestfile)
	forest, err := forestreader.ReadForest()
	if err != nil {
		log.Fatal(err)
	}

	var bb CloudForest.VoteTallyer
	switch {
	default:
		bb = CloudForest.NewCatBallotBox(data.Data[0].Length())
	}

	for _, tree := range forest.Trees {
		tree.Vote(data, bb)
	}

	//_, _ := data.Map[forest.Target]

	for i := range data.CaseLabels {
		result := ""

		if forest.Intercept != 0.0 {
			numresult := bb.(*CloudForest.NumBallotBox).TallyNum(i) + forest.Intercept
			result = fmt.Sprintf("%v", numresult)
		} else {
			result = bb.Tally(i)
		}
		return result
	}
	return ""
}
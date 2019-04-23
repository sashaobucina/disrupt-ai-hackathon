import React, { Component } from 'react';
import { RegionSelector } from "../Selector/RegionSelector";
import BootstrapTable from 'react-bootstrap-table-next';
import axios from "axios";
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Loader } from '../Loader/Loader';

const filterData = (dataSet) => {
  return dataSet.map(data => {
    const projected5yrs = data.SuggestedBranches5yr ? data.SuggestedBranches5yr : 'N/A'
    const projected10yrs = data.SuggestedBranches10yr ? data.SuggestedBranches10yr : 'N/A'
    return {
      city: data.Name,
      currentPop: data.CurrentPopulation,
      currentBranches: data.Branches,
      projectedBranches5yrs: projected5yrs,
      projectedBranches10yrs: projected10yrs
    }
  })
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      region: 'British Columbia',
      products: [],
      columns: [
        {
          dataField: 'city',
          text: 'City'
        },
        {
          dataField: 'currentPop',
          text: 'Current Population'
        },
        {
          dataField: 'currentBranches',
          text: 'Current # of Branches'
        },
        {
          dataField: 'projectedBranches5yrs',
          text: 'Optimal # of Branches (5 years)'
        },
        {
          dataField: 'projectedBranches10yrs',
          text: 'Optimal # of Branches (10 years)'
        }
      ]
    }
  }

  selectRegion(val) {
    this.setState({ region: val })
  }

  populateData(products) {
    setTimeout(() => {
      this.setState({
        products: products,
        isLoading: false
      })
    }, 1000)
  }

  emptyResponse() {
    this.setState({
      products: [{
        city: 'No data available yet',
        currentPop: 'N/A',
        currentBranches: 'N/A',
        projectedBranches5yrs: 'N/A',
        projectedBranches10yrs: 'N/A'
      }],
      isLoading: false
    })
  }

  tableRefresh() {
    this.setState(state => ({
      products: [],
      isLoading: !state.isLoading
    }))
  }

  getData() {
    this.tableRefresh()
    const url = `http://aggregator-l337disrupt.westus.azurecontainer.io/aggregate?region=${this.state.region}`
    axios.get(url)
      .then(result => {
        const filteredData = filterData(result.data)
        this.populateData(filteredData)
      })
      .catch(err => {
        console.error(err)
        this.emptyResponse()
      })
  }

  render() {
    return (<>
      <div className="container" style={{ marginTop: 50, textAlign: "center" }}>
        <RegionSelector region={this.state.region} selector={(val) => this.selectRegion(val)} onClick={() => this.getData()}/>
        {this.state.products.length === 0
          ? null
          : <BootstrapTable 
              striped
              hover
              keyField='city' 
              data={ this.state.products } 
              columns={ this.state.columns } /> }
        <Loader isLoading={this.state.isLoading} />
      </div>
    </>);
  }
}

export default App;

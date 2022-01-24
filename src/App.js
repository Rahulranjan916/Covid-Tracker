import {Card, CardContent, FormControl, MenuItem, Select} from '@material-ui/core';
import './App.css';
import React, { useEffect, useState } from 'react';

// eslint-disable-next-line no-unused-vars
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {sortData} from './util';
import LineGraph from './LineGraph';

// https://disease.sh/v3/covid-19/countries

function App() {
  // eslint-disable-next-line no-unused-vars
  const[countries, setCountries] = useState([]);
  const[country, setCountry] = useState('Worldwide')
  const[countryInfo, setCountryInfo ] = useState({});
  const[tableData, setTableData] = useState([]);
  // const [casesType, setCasesType] = useState("cases");

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then((data) => {
      setCountryInfo(data);
    });
  },[]);

  //USE EFFECT = Runs a piece of code based on a given condition
  useEffect(() =>{
    //The code inside here wil run once when the component loads and not again
    // async-> send a request, wait for it , do something with  info

    // eslint-disable-next-line no-unused-vars
    const getCountriesData = async() =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) =>{
        const countries = data.map((country) => (
          {
            name : country.country, //United State, United Kingdom 
            value :country.countryInfo.iso2 // UK, USA, FR
          }
        ));
           const sortedData = sortData(data);
            setTableData(sortedData);
            setCountries(countries);
      });
    };
    getCountriesData();
    },[]);

    const onCountryChange = async(event) => {
      const countryCode = event.target.value;
      setCountry(countryCode);

      const url = countryCode ==='Worldwide' ? `https://disease.sh/v3/covid-19/all` : 
      `https://disease.sh/v3/covid-19/countries/${countryCode}`;

      await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);

        //All of the data....from the country response
        setCountryInfo(data);
      });
  
    }

  return (
    //  State = How to write a variable in REACT <<<<<

    <div className="App">
      <div className='App_left'>
        <div className='App_header'>
    <h1>COVID-19 TRACKER</h1>

     <FormControl className="app_dropdown">
      <Select variant ="outlined"
      onChange={onCountryChange}
     value={country}>

     {/*Loop through all the countries and show a drop down list of the options */}
     <MenuItem value="Worldwide">Worldwide</MenuItem>
       {
         countries.map(country =>(
          <MenuItem value={country.value}>{country.name}</MenuItem>
          
         ))
       }
      </Select>
      </FormControl>
    </div>
     

     <div className='app_stats'>
     <InfoBox title="CoronaVirus cases" cases={countryInfo.todayCases} total={countryInfo.cases}></InfoBox>

     <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}></InfoBox>

     <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}></InfoBox>
     </div>
     <Map></Map>
       </div>

       <Card className='App_right'>
       <CardContent>
         <h3>Live cases by country</h3>
        <Table countries={tableData}/>
         <h3> Worldwide New cases</h3>
       <LineGraph/> 
       </CardContent>
    </Card>

    </div>
  );
}

export default App;

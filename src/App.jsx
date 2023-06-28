import { useState, useEffect } from "react";
import Map from "./Map";

const endpoint = "https://store.piemadd.com/cta_trains";

const lines = {
  Red: {
    name: "Red",
    color: "#c60c30",
    textColor: "#ffffff",
    destinations: ["Howard", "95th/Dan Ryan"],
    replacements: [],
  },
  Purple: {
    name: "Purple",
    color: "#522398",
    textColor: "#ffffff",
    destinations: ["Linden", "Howard", "Loop"],
    replacements: [],
  },
  Yellow: {
    name: "Yellow",
    color: "#f9e300",
    textColor: "#000000",
    destinations: ["Howard", "Skokie"],
    replacements: [],
  },
  Blue: {
    name: "Blue",
    color: "#00a1de",
    textColor: "#ffffff",
    destinations: ["O'Hare", "Forest Park", "UIC-Halsted"],
    replacements: [],
  },
  Pink: {
    name: "Pink",
    color: "#e27ea6",
    textColor: "#ffffff",
    destinations: ["Loop", "54th/Cermak"],
    replacements: [],
  },
  Green: {
    name: "Green",
    color: "#009b3a",
    textColor: "#ffffff",
    destinations: ["Harlem/Lake", "Ashland/63rd", "Cottage Grove"],
    replacements: [
      ["Ashland/63rd", "63rd"],
      ["Cottage Grove", "63rd"],
    ],
  },
  Brown: {
    name: "Brown",
    color: "#633b1b",
    textColor: "#ffffff",
    destinations: ["Loop", "Kimball"],
    replacements: [],
  },
  Orange: {
    name: "Orange",
    color: "#ff4f02",
    textColor: "#ffffff",
    destinations: ["Loop", "Midway"],
    replacements: [],
  },
};

const App = () => {
  const [destinationHeadways, setDestinationHeadways] = useState({});
  const [runNumbers, setRunNumbers] = useState([]);
  const [trains, setTrains] = useState([]); //trains that are currently being displayed
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState("table");
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const updateData = async () => {
      const response = await fetch(endpoint);
      const data = await response.json();

      let allDestinations = {};
      //let allStations = {};
      let allRunNumbers = [];

      //filling in default data for non tracking trains
      Object.keys(lines).forEach((line) => {
        lines[line].destinations.forEach((destination) => {
          allDestinations[`${line}-${destination}`] = {
            line,
            stationKey: destination,
            headways: "N/A",
            numOfTrains: 0,
          };
        });
      });

      // data for the per line sorting
      Object.keys(data.lines).forEach((line) => {
        const lineData = data.lines[line];

        Object.keys(lineData).forEach((stationKey) => {
          allDestinations[`${line}-${stationKey}`] = {
            line,
            stationKey,
            headways:
              lineData[stationKey].runNumbers.length === 1
                ? `in ${Math.round(lineData[stationKey].avgHeadway)} min`
                : `Every ~${Math.round(lineData[stationKey].avgHeadway)} min`,
            numOfTrains: lineData[stationKey].runNumbers.length,
          };

          allRunNumbers = [
            ...allRunNumbers,
            ...lineData[stationKey].runNumbers,
          ];
        });
      });

      //removing duplicates from allRunNumbers
      allRunNumbers = [...new Set(allRunNumbers)];

      setDestinationHeadways(allDestinations);
      //setLineHeadways(allStations);
      setRunNumbers(allRunNumbers);
      setTrains(Object.values(data.trains));
      setLoading(false);
      setLastUpdated(new Date());

      setTimeout(() => updateData(), Number(data.interval));

      console.log("Updated Data");
    };

    updateData();
  }, []);

  return (
    <>
      <h1>CTA System Headways</h1>
      <p>
        v0.2.3 | Made by <a href='https://piemadd.com/'>Piero</a>
      </p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Last Updated: {lastUpdated.toLocaleString()}</p>
          <p
            style={{
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            {runNumbers.length} trains are currently running
          </p>
          <main>
            <div className='data-source-selector'>
              <button
                type='radio'
                name='data-source'
                id='table'
                value='table'
                onClick={(e) => {
                  console.log("Setting to", e.target.value);
                  setDataSource(e.target.value);
                }}
                className={
                  dataSource === "table" ? "data-source-selected" : undefined
                }
              >
                Table
              </button>
              <button
                type='radio'
                name='data-source'
                id='map'
                value='map'
                onClick={(e) => {
                  console.log("Setting to", e.target.value);
                  setDataSource(e.target.value);
                }}
                className={
                  dataSource === "map" ? "data-source-selected" : undefined
                }
              >
                Map
              </button>
            </div>
            {dataSource === "table" ? (
              <section className='headways'>
                {Object.values(destinationHeadways).map((destination) => {
                  return (
                    <div
                      key={`${destination.line}-${destination.stationKey}`}
                      style={{
                        backgroundColor: lines[destination.line].color,
                        color: lines[destination.line].textColor,
                      }}
                    >
                      <p>{lines[destination.line].name} Line towards</p>
                      <h2>{destination.stationKey}</h2>
                      {destination.numOfTrains === 1 ? (
                        <p>Only train terminates</p>
                      ) : null}
                      <p
                        style={{
                          fontSize: "1.5rem",
                        }}
                      >
                        {destination.headways}
                      </p>
                      {destination.numOfTrains === 1 ? null : (
                        <p>
                          {destination.numOfTrains}{" "}
                          {destination.numOfTrains === 1 ? "train" : "trains"}{" "}
                          running
                        </p>
                      )}
                    </div>
                  );
                })}
              </section>
            ) : null}
            {dataSource === "map" ? <Map trains={trains} lines={lines} /> : null}
          </main>
        </>
      )}
    </>
  );
};

export default App;

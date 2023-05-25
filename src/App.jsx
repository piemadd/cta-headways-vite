import { useState, useEffect } from "react";

const endpoint = "https://ctaheadwaysapi.piemadd.com/all";

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
  //const [lineHeadways, setLineHeadways] = useState({});
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState("line");

  useEffect(() => {
    const updateData = async () => {
      const response = await fetch(endpoint);
      const data = await response.json();

      let allDestinations = {};
      //let allStations = {};

      //filling in default data for non tracking trains
      Object.keys(lines).forEach((line) => {
        lines[line].destinations.forEach((destination) => {
          allDestinations[`${line}-${destination}`] = {
            line,
            stationKey: destination,
            headways: "N/A",
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
            headways: `${Math.round(lineData[stationKey].avgHeadway)} min`,
          };
        });
      });

      setDestinationHeadways(allDestinations);
      //setLineHeadways(allStations);
      setLoading(false);

      setTimeout(() => updateData(), Number(data.interval));

      console.log("Updated Data");
    };

    updateData();
  }, []);

  return (
    <>
      <h1>CTA System Headways</h1>
      <p>v0.1.0</p>
      <p>Made by <a href='https://piemadd.com/'>Piero</a></p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <main>
          <p
            style={{
              textAlign: "center",
              fontSize: "1.5rem",
              marginBottom: "8px",
            }}
          >
            Sort Data by
          </p>
          <div className='data-source-selector'>
            <button
              type='radio'
              name='data-source'
              id='line'
              value='line'
              onClick={(e) => {
                console.log("Setting to", e.target.value);
                setDataSource(e.target.value);
              }}
              className={
                dataSource === "line" ? "data-source-selected" : undefined
              }
            >
              Line
            </button>
            <button
              type='radio'
              name='data-source'
              id='station'
              value='station'
              onClick={(e) => {
                console.log("Setting to", e.target.value);
                setDataSource(e.target.value);
              }}
              className={
                dataSource === "station" ? "data-source-selected" : undefined
              }
            >
              Station
            </button>
          </div>
          {dataSource === "line" ? (
            <section className='headways'>
              {Object.values(destinationHeadways).map((destination) => {
                return (
                  <div key={`${destination.line}-${destination.stationKey}`} style={{
                    backgroundColor: lines[destination.line].color,
                    color: lines[destination.line].textColor,
                  }}>
                    <p>{lines[destination.line].name} Line towards</p>
                    <h2>{destination.stationKey}</h2>
                    <p style={{
                      fontSize: "1.5rem",
                    }}>{destination.headways}</p>
                  </div>
                );
              })}
            </section>
          ) : null}
          {dataSource === "station" ? (
            <p>Sorry, this section is currently being worked on!</p>
          ) : null}
        </main>
      )}
    </>
  );
};

export default App;

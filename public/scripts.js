let globeFeatures=[];
let covidData = [];
const covidDataObj = {};
let world;


const colorScale = d3.scaleSequentialPow(d3.interpolateYlOrRd).exponent(1 / 4);
const getVal = feat => feat.covidData.active*100 / feat.properties.POP_EST;

function createGlobe(){
    world = Globe()
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .lineHoverPrecision(0)
        .polygonAltitude(0.06)
        .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
        .polygonStrokeColor(() => '#111')
        .polygonLabel(({ properties: d, covidData: c }) => 
         `
        <div class="label-container">
             <img src=${c.countryInfo.flag}></img>
             <span class="label-title">${d.NAME}</span>
             <div class="label-body">
             <div>Active Cases: ${c.active}</div> 
             <div>Deaths: ${c.deaths}</div>
             <div>Recovered: ${c.recovered}</div>
             <div>Population: ${c.population}</div>
             </div>
        </div>`
    )
        .onPolygonHover(hoverD => world
        .polygonAltitude(d => d === hoverD ? 0.12 : 0.06)
        .polygonCapColor(d => d === hoverD ? 'steelblue' : colorScale(getVal(d)))
        )
        .polygonsTransitionDuration(300)
    (document.getElementById('covidGlobe'))
};

async function getData(){
    globeFeatures = (await request('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson')).features;
    covidData = await request('https://disease.sh/v3/covid-19/countries');

    covidData.forEach(c=>{
        covidDataObj[c.country.toLowerCase().split(" ").join('')] = c;
    });
    updateGlobeData();

}

getData();

function updateGlobeData() {
    console.log(globeFeatures);
    console.log(covidData);
    globeFeatures.forEach(feature => {
        const countryName =  feature.properties.NAME.toLowerCase();
        if(covidDataObj.hasOwnProperty(countryName)){
            feature['covidData'] = covidDataObj[countryName];
            console.log('found', countryName);
        }
        else{
            console.log('Not Found', countryName);
            feature['covidData'] = covidDataObj['austria'];
        }
    })
    console.log(globeFeatures);
    createGlobe();
    world.polygonsData(globeFeatures);
}

async function request(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data;
    } catch (e) {
        throw e;
    }
}
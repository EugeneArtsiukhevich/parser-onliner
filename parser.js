const axios = require('axios');

const {dateDiffInDays} = require('./utils');

const url = `https://pk.api.onliner.by/search/apartments`;

const createParams = (page=1) => {
    const params = new Map([
        ['bounds[lb][lat]', 53.861997818063436],
        ['bounds[lb][long]', 27.236291832623085],
        ['bounds[rt][lat]', 53.94206869588304],
        ['bounds[rt][long]', 27.88863644183089],
        ['number_of_rooms[0]', 1],
        ['number_of_rooms[1]', 2],
        ['building_year[min]', 2000],
        ['building_year[max]', 2020],
        ['price[min]', 45000],
        ['price[max]', 90000],
        ['currency', 'usd'],
        ['page', page],
    ])

    let query = `?`;
    params.forEach((val, key) => {
        query = query + `${key}=${val}&`;
    });
    return query;
};

const getData = async url => {
    console.log(`REQUESTED URL: ${url}`);

    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        console.error(err);
    }
};

const gatherApartments = async url => {
    try {
        const data = await getData(url + createParams());

        let currentPage = data.page.current;
        let lastPage = data.page.last;
        let apartments = data.apartments;
    
        while(currentPage < lastPage) {
            currentPage++;
            let res = await getData(url + createParams(currentPage))
            apartments = [...apartments, ...res.apartments]
        }
    
        return apartments;
    } catch(err) {
        console.log(err);
    }
};

const filterByLastFloor = (apartments) => {
    return apartments.filter(appartment => (appartment.number_of_floors - appartment.floor) === 0);
}

const filterByDate = (apartments, day=1) => {
    const today = new Date();

    return apartments.filter(appartment => {
        const updated = new Date(appartment.last_time_up);
        return dateDiffInDays(updated, today) < day;
    });
}

const gather = async(duration) => {
    const apartments = await gatherApartments(url);
    const apartmentsOnLastFloor = filterByLastFloor(apartments);
    const accomodation = filterByDate(apartmentsOnLastFloor, duration);

    return accomodation;
};

module.exports = {
    gather: gather
}
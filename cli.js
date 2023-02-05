#!/usr/bin/env node

import minimist from "minimist";
import moment from "moment-timezone";
import fetch from "node-fetch";

let args = minimist(process. argv.slice(2));

if (args.h) {
    console.log('Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE' +
        '\n\t-h            Show this help message and exit.' +
        '\n\t-n, -s        Latitude: N positive; S negative.' +
        '\n\t-e, -w        Longitude: E positive; W negative.' +
        '\n\t-z            Time zone: uses tz.guess() from moment-timezone by default.' +
        '\n\t-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.' +
        '\n\t-j            Echo pretty JSON from open-meteo API and exit.');
    process.exit(0);
}

var timezone, day;
if (args.z) {
    timezone = args.z;
} else {
    timezone = moment.tz.guess();
}

if (args.d) {
    day = args.d;
} else {
    day = 1;
}

var latitude, longitude;
if (args.n) {
    latitude = Math.round((args.n + Number.EPSILON) * 100) / 100;
} else {
    latitude = -Math.round((args.s + Number.EPSILON) * 100) / 100;
}

if(args.e) {
    longitude = Math.round((args.e + Number.EPSILON) * 100) / 100;
} else {
    longitude = -Math.round((args.w + Number.EPSILON) * 100) / 100;
}

const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&timezone=' + timezone + '&daily=precipitation_hours');
const data = await response.json();

if (args.j) {
    console.log(data);
    process.exit(0);
}

var day_msg;
if (day == 0) {
    day_msg ="today.";
} else if (day > 1) {
    day_msg = "in " + day + " days.";
} else {
    day_msg = "tomorrow.";
}

if (data.daily.precipitation_hours[day] == 0) {
    console.log("You won't need your galoshes " + day_msg);
} else {
    console.log("You will probably need your galoshes " + day_msg);
}


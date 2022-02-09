/**
 * 
 * 
 * Resources:
 * https://jamessapp.medium.com/dom-cheat-sheet-ae4bf2299bee
 * https://kryogenix.org/code/browser/sorttable/
 */

console.log('EI TABLE JS LOADED')

fetch('eldritchInnvocations.json')
    .then(response => response.json())
    .then(data => {
        createTable(data['Eldritch Innvocations'])
    })

const createTable = (data) => {
    //document.querySelector('#eiTable').innerHTML = JSON.stringify(data);
    //console.log(eiJSON)

    let table = document.createElement('table');
    //table.className = 'sortable' //using sorttable.js
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');

    table.appendChild(thead);
    table.appendChild(tbody);

    document.querySelector('#eiTable').appendChild(table)

    createHeaders(data)

    addDataRows(data)

    sorttable.makeSortable(table);
}

const createHeaders = (data) => {
    let headers = ['Eldritch Innvocation','Level','Pact','Other','Description'];

    let thead = document.querySelector('thead');
    let row = document.createElement('tr');

    headers.forEach((headerText) => {
        let heading = document.createElement('th');
        heading.innerHTML = headerText;

        row.appendChild(heading);
    })

    thead.appendChild(row);
}

const addDataRows = (data) => {
    let tbody = document.querySelector('tbody');

    data.forEach((ei) => {
        let headers = ['Eldritch Innvocation','Level','Pact','Other','Description'];

        let row = document.createElement('tr');

        let name = document.createElement('td');
        name.className = 'eldritchInnvocation';
        name.innerHTML = ei.Name;
        row.appendChild(name);
        
        let level = document.createElement('td')
        level.innerHTML = ei.Prerequisites.Level || '';
        level.className = 'level';
        row.appendChild(level);
        
        let pact = document.createElement('td');
        pact.className = 'pact';
        pact.innerHTML = ei.Prerequisites.Pact || '';
        row.appendChild(pact);

        let other = document.createElement('td');
        other.className = 'other';
        other.innerHTML = ei.Prerequisites.Other || '';
        row.appendChild(other);
        
        let description = document.createElement('td');
        //console.log(ei.Description)
        eiDesc = ei.Description.replace(/\n/g,'<br>');
        description.innerHTML = `<p>${eiDesc || " "}</p>`;
        row.appendChild(description)
        
        tbody.appendChild(row)
    })
}
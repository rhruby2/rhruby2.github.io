/**
 * projects.js
 * 
 * Raymond Hruby II
 * 05/18/22
 */
console.log('loading index.js');

//making global object to use for creating modals on click
var PROJECT_DATA;


/* wait until page load to add event listeners for modals*/
window.addEventListener("load", () => {
    let modal = document.querySelector(".modal");
    console.log(modal);
    let modalClose = document.querySelector(".modal-close");
    console.log(modalClose);

    window.onclick = (event) => {
        if(event.target == modal){
            modal.style.display = 'none';
        }
    }
    modalClose.onclick = () => {
        modal.style.display = 'none';
    }
})

/* add in project data from JSON*/
fetch('scripts/portfolioProjects.json')
    .then(response => response.json())
    .then(data => {
        //making global object to use for creating modals on click
        PROJECT_DATA = data['projects'];
        createProjectsSection(PROJECT_DATA);
    });

const createProjectsSection = (projects) => {
    const projectsSection = document.querySelector('#projects');
    let projectTiles = projects.map((project, index) => createProjectTile(project, index));
    
    projectsSection.append(...projectTiles);
}

const createProjectTile = (project, index) => {
    console.log(project.header);

    let projectTile;

    if(!project.modal){
        projectTile = document.createElement('a');
        projectTile.setAttribute('href', project.link);
        projectTile.setAttribute('target','_blank');
    }
    //add distinct stylings and added functionality if modal content exists
    if(project.modal){
        projectTile = document.createElement('a');
        projectTile.classList.add('outline');
        projectTile.addEventListener('click', (event) => {
            console.log(event);
            createAndShowModal(event);
        });
    }

    projectTile.classList.add('project-tile');

    projectTile.setAttribute('id', index);

    projectTile.append(createProjectTileImage(project));
    projectTile.append(createProjectTileTags(project));
    projectTile.append(document.createElement('hr'));
    projectTile.append(createProjectTileBody(project));

    return projectTile;
}

const createAndShowModal = (event) => {
    console.log(event.target);
    //search through event path to find parent project tile
    let projectTileIndex = getProjectTileIndex(event);
    console.log(projectTileIndex);

    let projectTile = event.path[projectTileIndex];

    //get id of project tile that should match JSON index
    let projectTileId = projectTile.getAttribute('id');
    console.log(projectTileId);

    let modalData = PROJECT_DATA[projectTileId].modal;

    let modal = document.createElement('div');
    modal.className= 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <h1 class="modal-header">${PROJECT_DATA[projectTileId].header}</h1>
            <p class="modal-description">${modalData.description}</p>
            <div class="modal-media">
                <img class="modal-gif" src=${modalData.gif.src}>
            </div>
            
            <div class="modal-link-source">
                <a href = ${PROJECT_DATA[projectTileId].link} target="_blank">Source Code</a> 
            </div>
        </div>
    `;

    let modalContent = modal.querySelector('.modal-content');

    modalContent.append(createModalDownloadInstructions(modalData));

    //modal does not work if appended to 'body' .: prepending to body
    document.body.prepend(modal);

    let modalClose = document.querySelector(".modal-close");
    console.log(modalClose);

    //destroy opened modal upon closing it
    window.onclick = (event) => {
        if(event.target == modal){
            modal.style.display = 'none';
            document.body.removeChild(modal);
        }
    }
    modalClose.onclick = () => {
        modal.style.display = 'none';
        document.body.removeChild(modal);
    }
}

const createModalDownloadInstructions = (modalData) => {
    let modalDownloadInstructions = document.createElement('div');
    modalDownloadInstructions.className = "modal-download-instructions";

    let instructionHeader = document.createElement('h2');
    instructionHeader.innerText = "Download Instructions";

    /* REQUIREMENTS */
    let requirementsHeader = document.createElement('h3');
    requirementsHeader.innerText = "Requirements:";

    let requirementsList = document.createElement('ul');
    modalData.downloadInstructions.requirements.forEach((item) => {
        let listItem = document.createElement('li');
        listItem.innerText = item;

        requirementsList.appendChild(listItem);
    });

    /* STEPS TO RUN APPLICATION */
    let stepsHeader = document.createElement('h3');
    stepsHeader.innerText = "Steps to Run Application";

    let stepsList = document.createElement('ol');
    modalData.downloadInstructions.stepsToRunApplication.forEach((item) => {
        let listItem = document.createElement('li');
        listItem.innerHTML = item;

        stepsList.appendChild(listItem);
    })

    modalDownloadInstructions.append(
        instructionHeader, 
        requirementsHeader, 
        requirementsList, 
        stepsHeader, 
        stepsList);

    return modalDownloadInstructions;
}

/**
 * finds the Project Tile Index in the click event path
 * 
 * @param {*} event 
 * @returns {Number} projectTileIndex
 */
const getProjectTileIndex = (event) => {
    for(let i = 0; i<event.path.length; i++){
        let item = event.path[i];

        if(item.classList.contains('project-tile')){
            console.log(i);
            return i;
        }
    }
}

const createProjectTileImage = (project) => {
    let webpImages = project.images.webp.srcsetFileNames;
    let fallbackImages = project.images.fallback.srcsetFileNames;
    let directory = project.images.directory;

    let projectTileImage = document.createElement('div');
    projectTileImage.classList.add('project-tile-img');

    let picture = document.createElement('picture');
    let source = document.createElement('source');
    source.setAttribute('type', 'image/webp');
    source.setAttribute('srcset',`${directory}/${webpImages[0]} 1x, ${directory}/${webpImages[1]} 2x`)

    let image = document.createElement('img');
    image.setAttribute('src',`${directory}/${project.images.fallback.srcFileName}`);
    image.setAttribute('srcset',`${directory}/${fallbackImages[0]} 1x, ${directory}/${fallbackImages[1]} 2x`)
    image.setAttribute('alt', project.images.altText);

    picture.append(source);
    picture.append(image);
    projectTileImage.append(picture);

    return projectTileImage;
}

const createProjectTileTags = (project) => {
    let p = document.createElement('p');
    p.classList.add('project-tile-tags');
    p.innerText = project.tags.join(' | ');

    return p;
}

const createProjectTileBody = (project) => {
    let projectTileBody = document.createElement('div');
    projectTileBody.classList.add('project-tile-body');

    let projectTileHeader = document.createElement('h1');
    projectTileHeader.classList.add('project-tile-header');
    projectTileHeader.innerText = project.header;

    let projectTileDescription = document.createElement('p');
    projectTileDescription.classList.add('project-tile-description');
    projectTileDescription.innerText = project.description;

    projectTileBody.append(projectTileHeader, projectTileDescription);

    return projectTileBody;
}
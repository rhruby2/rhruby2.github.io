/**
 * projects.js
 * 
 * Raymond Hruby II
 * 05/18/22
 */
console.log('loading index.js');

//making global object to use for creating modals on click
var PROJECT_DATA;

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

    let projectTile = document.createElement('a');
    projectTile.classList.add('project-tile');
    projectTile.setAttribute('id', index);

    if(!project.modal){
        projectTile.setAttribute('href', project.link);
        projectTile.setAttribute('target','_blank');
    }
    //add distinct stylings and added functionality if modal content exists
    if(project.modal){
        projectTile.classList.add('outline');
        projectTile.addEventListener('click', (event) => {
            console.log(event);
            createModal(event);
        });
    }

    projectTile.append(
        createProjectTileImage(project),
        createProjectTileTags(project),
        document.createElement('hr'),
        createProjectTileBody(project)
    );

    return projectTile;
}

const createModal = (event) => {
    let projectData = getProjectData(event);
    let modalData = projectData.modal;

    //firstElementChild needed to change DocumentFragment into HTMLElement so event listeners can work
    let modal = document.querySelector("#template_modal").content.firstElementChild.cloneNode(true);
    modal.querySelector(".modal-header").innerText = projectData.header;
    modal.querySelector(".modal-description").innerText = projectData.description;
    modal.querySelector(".modal-gif").src = modalData.gif.src;
    modal.querySelector(".modal-link-source").querySelector("a").href = projectData.link;
    modal.querySelector('.modal-content').append(createModalDownloadInstructions(modalData));

    //destroy opened modal upon closing it
    window.onclick = (event) => {
        if(event.target == modal){
            modal.style.display = 'none';
            document.body.removeChild(modal);
        }
    }
    modal.querySelector(".modal-close").onclick = () => {
        modal.style.display = 'none';
        document.body.removeChild(modal);
    }

    //modal does not work if appended to 'body' .: prepending to body
    document.body.prepend(modal);
}

const getProjectData = (event) => {
    let pathIndex = getProjectTileIndex(event);
    let projectHeader= event.composedPath()[pathIndex].querySelector(".project-tile-header").innerText;

    console.log(projectHeader);
    let projectData = PROJECT_DATA.filter((project) => {
        console.log(project.header);
        return project.header === projectHeader;
    })

    return projectData[0];
}

/**
 * finds the Project Tile Index in the click event path array
 * 
 * @param {*} event 
 * @returns {Number} projectTileIndex
 */
const getProjectTileIndex = (event) => {
    let path = event.composedPath();
    for(let i = 0; i<path.length; i++){
        if(path[i].classList.contains('project-tile')){
            return i;
        }
    }
}

const createModalDownloadInstructions = (modalData) => {
    let modalDownloadInstructions = document.querySelector("#template_modal-download-instructions").content.cloneNode(true);
    
    let requirementsList = modalDownloadInstructions.querySelector("ul");
    modalData.downloadInstructions.requirements.forEach((item) => {
        let listItem = document.createElement('li');
        listItem.innerText = item;

        requirementsList.appendChild(listItem);
    });

    let stepsList = modalDownloadInstructions.querySelector("ol");
    modalData.downloadInstructions.stepsToRunApplication.forEach((item) => {
        let listItem = document.createElement('li');
        listItem.innerHTML = item;

        stepsList.appendChild(listItem);
    });
    return modalDownloadInstructions;
}

const createProjectTileImage = (project) => {
    let webpImages = project.images.webp.srcsetFileNames;
    let fallbackImages = project.images.fallback.srcsetFileNames;
    let directory = project.images.directory;

    let projectTileImage = document.querySelector('#template_project-tile-img').content.cloneNode(true);
    
    Object.assign(projectTileImage.querySelector("source"),{
        'type': 'image/webp',
        'srcset': `${directory}/${webpImages[0]} 1x, ${directory}/${webpImages[1]} 2x`
    });

    Object.assign(projectTileImage.querySelector("img"),{
        'src': `${directory}/${project.images.fallback.srcFileName}`,
        'srcset': `${directory}/${fallbackImages[0]} 1x, ${directory}/${fallbackImages[1]} 2x`,
        'alt': project.images.altText
    });

    return projectTileImage;
}

const createProjectTileTags = (project) => {
    let projectTileTags = document.querySelector("#template_project-tile-tags").content.cloneNode(true);
    projectTileTags.querySelector(".project-tile-tags").innerText = project.tags.join(' | ');

    return projectTileTags;
}

const createProjectTileBody = (project) => {
    let projectTileBody = document.querySelector("#template_project-tile-body").content.cloneNode(true);
    projectTileBody.querySelector(".project-tile-header").innerText = project.header;
    projectTileBody.querySelector(".project-tile-description").innerText = project.description;
    
    return projectTileBody;
}
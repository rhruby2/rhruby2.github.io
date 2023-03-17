/**
 * projects.js
 * 
 * Raymond Hruby II
 * 05/18/22
 * 
 * TODO: use general media paths as defaults, use specfied path per project if specified
 * 
 * NOTES:
 * header key in project data objects need to be unique and
 * ".project-tile-header" element value needs to match header key for selecting the correct modal content.
 * 
 * .append() converts HTMLElements and DocumentFragments to DOM Nodes
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

/**
 * Creates project section by going through data objects and calling function to make DOM nodes for them
 * for each project. Then adds those to specified HTML section as nodes
 * @param {Object[]} projects 
 */
const createProjectsSection = (projects) => {
    const projectsSection = document.querySelector('#projects');
    
    let projectTiles = projects.map((project) => createProjectTile(project));
    //append converts HTMLElements to DOM Nodes
    projectsSection.append(...projectTiles);
}

/**
 * Creates a full project tile/card DOM node using HTML Templates. 
 * Dynamically adds modal content if detected. Modal content will show instead of hyperlink to sources.
 * @param {Object} project 
 * @returns {HTMLAnchorElement} projectTile DOM node. Projects are defined as anchors for hyperlinking.
 */
const createProjectTile = (project) => {
    console.log(project.header);

    let projectTile = document.createElement('a');
    projectTile.classList.add('project-tile');

    //dynamically adds modal content if detected
    let containsModal = "modal" in project && project.modal !== undefined;
    if(!containsModal){
        projectTile.setAttribute('href', project.link);
        projectTile.setAttribute('target','_blank');
    }
    //add distinct stylings and added on-click functionality if modal content exists
    if(containsModal){
        projectTile.classList.add('outline');
        projectTile.addEventListener('click', (event) => {
            console.log(event);
            createDynamicModal(event);
        });
    }

    //componentized project creation
    projectTile.append(
        createProjectTileImage(project),
        createProjectTileTags(project),
        document.createElement('hr'),
        createProjectTileBody(project)
    );

    return projectTile;
}

/**
 * Dynamically creates Modal for a project anchor link if modal content detected in the data object and 
 * the click event was registered on the HTML project tile.
 * Modal destroyed on exit.
 * @param {*} event
 */
const createDynamicModal = (event) => {
    let projectData = getProjectData(event);
    let modalData = projectData.modal;

    //firstElementChild needed to change DocumentFragment into HTMLElement so event listeners can work
    let modal = document.querySelector("#template_modal").content.firstElementChild.cloneNode(true);
    modal.querySelector(".modal-header").innerText = projectData.header;
    modal.querySelector(".modal-description").innerText = projectData.description;
    modal.querySelector(".modal-gif").src = modalData.gif.src;
    modal.querySelector(".modal-link-source").querySelector("a").href = projectData.link;
    if("downloadInstructions" in modalData && modalData["downloadInstructions"]!== undefined){
        modal.querySelector('.modal-content').append(createModalDownloadInstructions(modalData));
    }
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

/**
 * Grabs project data from data object related to the project that registered the click event.
 * Finds related data by matching project name (.project-tile-header) to the header key in data object.
 * .: Assumes each project header will be unique.
 * @param {*} event 
 * @returns {Object} projectData
 */
const getProjectData = (event) => {
    //bubble up the click event path to get the project tile element
    let projectTilePathIndex = getProjectTileIndex(event);
    //select the header from the found project element
    let projectHeader= event.composedPath()[projectTilePathIndex].querySelector(".project-tile-header").innerText;

    console.log(projectHeader);
    //loops through data object array until found matching header value
    let projectData = PROJECT_DATA.filter((project) => {
        console.log(project.header);
        return project.header === projectHeader;
    })

    return projectData[0];
}

/**
 * finds the index in the click event path array denoting the overall Project tile
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

/**
 * Creates modal download instructions component for the modal
 * @param {Object} modalData 
 * @returns {HTMLElement} modalDownloadInstructions
 */
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

/**
 * Creates project image component
 * @param {Object} project - project data
 * @returns {DocumentFragment} projectTileImage
 */
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

/**
 * Creates project tags component
 * @param {Object} project -project data
 * @returns {DocumentFragment} projectTileTags
 */
const createProjectTileTags = (project) => {
    let projectTileTags = document.querySelector("#template_project-tile-tags").content.cloneNode(true);
    projectTileTags.querySelector(".project-tile-tags").innerText = project.tags.join(' | ');

    return projectTileTags;
}

/**
 * Creates project body component
 * @param {Object} project 
 * @returns {DocumentFragment} projectTileBody
 */
const createProjectTileBody = (project) => {
    let projectTileBody = document.querySelector("#template_project-tile-body").content.cloneNode(true);
    projectTileBody.querySelector(".project-tile-header").innerText = project.header;
    projectTileBody.querySelector(".project-tile-description").innerText = project.description;
    
    return projectTileBody;
}
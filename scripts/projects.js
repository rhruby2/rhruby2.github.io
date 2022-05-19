/**
 * projects.js
 * 
 * Raymond Hruby II
 * 05/18/22
 */
console.log('loading index.js');

fetch('scripts/portfolioProjects.json')
    .then(response => response.json())
    .then(data => {
        createProjectsSection(data['projects'])
    });

const createProjectsSection = (projects) => {
    const projectsSection = document.querySelector('#projects');
    let projectTiles = projects.map((project) => createProjectTile(project));
    
    projectsSection.append(...projectTiles);
}

const createProjectTile = (project) => {
    console.log(project.header);

    let projectTile = document.createElement('a');
    projectTile.classList.add('project-tile');
    projectTile.setAttribute('href', project.link);
    projectTile.setAttribute('target','_blank');

    projectTile.append(createProjectTileImage(project));
    projectTile.append(createProjectTileTags(project));
    projectTile.append(document.createElement('hr'));
    projectTile.append(createProjectTileBody(project));

    return projectTile;
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
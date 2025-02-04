//import './src/components/mainComponent.js'
import './src/components/vehiclesMenuComponent.js'
//import './src/components/vehiclesComponent.js'
import './Models/vehicleModel.js'
import './src/js/gestor.js'
import './src/components/formDataDriving.js'
import { setupVehicleClickListener } from './src/js/gestor.js';
setupVehicleClickListener();

document.addEventListener('DOMContentLoaded', async () => {
    // Importar los componentes dinámicamente
    await Promise.all([
        import('./src/components/teamComponent.js'),
        import('./src/components/adminTeamComponent.js'),
        import('./src/components/driversComponent.js')
    ]);
    
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // Función para cambiar sección
    const changeSection = async (targetId) => {
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        const targetLink = document.querySelector(`[href="#${targetId}"]`);
        const targetSection = document.getElementById(targetId);

        if (targetLink) targetLink.classList.add('active');
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Si es la sección de equipos, forzar una recarga de los datos
            if (targetId === 'teams') {
                const teamComponent = targetSection.querySelector('team-component');
                if (teamComponent) {
                    await teamComponent.loadData();
                }
            }
        }
    };

    // Event listeners para los links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            changeSection(targetId);
            history.pushState(null, '', `#${targetId}`);
        });
    });

    // Manejar navegación inicial y cambios en el hash
    const handleInitialNavigation = () => {
        const hash = window.location.hash.substring(1) || 'home';
        changeSection(hash);
    };

    window.addEventListener('hashchange', handleInitialNavigation);
    handleInitialNavigation();

    // Manejo del dashboard de Teams
    const initTeamsDashboard = () => {
        const dashboardOptions = document.querySelectorAll('.option-card');
        const backButtons = document.querySelectorAll('.back-button');
        const mainOptions = document.getElementById('teamsMainOptions');
        const views = {
            'view-teams': document.getElementById('teamsView'),
            'view-drivers': document.getElementById('driversView'),
            'manage-info': document.getElementById('manageView')
        };

        // Manejar clicks en las opciones
        dashboardOptions.forEach(option => {
            option.addEventListener('click', () => {
                const viewId = option.dataset.option;
                mainOptions.style.display = 'none';
                Object.values(views).forEach(view => view.style.display = 'none');
                views[viewId].style.display = 'block';
            });
        });

        // Manejar clicks en botones de volver
        backButtons.forEach(button => {
            button.addEventListener('click', () => {
                Object.values(views).forEach(view => view.style.display = 'none');
                mainOptions.style.display = 'grid';
            });
        });
    };

    initTeamsDashboard();
});


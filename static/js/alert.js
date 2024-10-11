export class Alert {
    constructor(type, title, message, parent = document.body) {
        this.type = type;
        this.title = title;
        this.message = message;
        this.timeouts = [];
        this.parent = parent;
        this.createAlert();
    }

    createAlert() {
        // Create alert container
        this.alert = document.createElement('div');
        this.alert.className = 'rounded-b shadow-none w-11/12 absolute z-10 top-0 left-1/2 -translate-x-1/2 -translate-y-full transition-all duration-500';

        // Create alert content
        const alertContent = `
            <div class="flex items-center p-4">
                <svg id="alert-icon" class="h-8 w-8 mr-4 flex-shrink-0"></svg>
                <div class="flex-1">
                    <span id="alert-title" class="font-semibold">${this.title}</span>
                    <p id="alert-message">${this.message}</p>
                </div>
                <button id="close-btn" class="text-2xl font-bold cursor-pointer">&times;</button>
            </div>
            <div id="progress-bar" class="h-2 w-0 transition-width duration-[5000ms]"></div>
        `;
        this.alert.innerHTML = alertContent;

        this.parent.appendChild(this.alert);

        this.progressBar = this.alert.querySelector('#progress-bar');
        this.closeButton = this.alert.querySelector('#close-btn');
        this.alertIcon = this.alert.querySelector('#alert-icon');

        this.setStyle(); // Set styles based on alert type

        this.show(); // Slide down the alert

        this.closeButton.addEventListener('click', () => this.close());  // Add close button functionality
    }

    setStyle() {
        switch (this.type) {
            case 'success':
                this.alert.classList.add('bg-teal-100', 'text-teal-900');
                this.progressBar.classList.add('bg-teal-500');
                this.alertIcon.setAttribute('class', 'stroke-2 stroke-current text-teal-500 h-8 w-8 mr-4 flex-shrink-0');
                this.alertIcon.innerHTML = '<circle cx="12" cy="12" r="9" /><path d="M9 12l2 2 4-4" />';
                this.closeButton.classList.add('text-teal-500');
                break;
            case 'error':
                this.alert.classList.add('bg-red-100', 'text-red-900');
                this.progressBar.classList.add('bg-red-500');
                this.alertIcon.setAttribute('class', 'stroke-current text-red-500 h-8 w-8 mr-4 flex-shrink-0');
                this.alertIcon.innerHTML = '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.83 0-1.5-.67-1.5-1.5S11.17 14 12 14s1.5.67 1.5 1.5S12.83 17 12 17zm1-4h-2V7h2v6z" />';
                this.closeButton.classList.add('text-red-500');
                break;
            case 'info':
                this.alert.classList.add('bg-blue-100', 'text-blue-900');
                this.progressBar.classList.add('bg-blue-500');
                this.alertIcon.setAttribute('class', 'fill-current h-8 w-8 text-blue-500 mr-4');
                this.alertIcon.innerHTML = '<path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />';
                this.closeButton.classList.add('text-blue-500');
                break;
        }
    }

    show() {
        this.timeouts.push(setTimeout(() => {
            this.alert.classList.replace('-translate-y-full', 'translate-y-0');
            this.alert.classList.replace('shadow-none', 'shadow-md');

            this.timeouts.push(setTimeout(() => this.progressBar.classList.replace('w-0', 'w-full'), 100));

            this.timeouts.push(setTimeout(() => this.close(), 5000));

        }, 100));
    }

    close() {
        this.alert.classList.replace('translate-y-0', '-translate-y-full');
        this.alert.classList.replace('shadow-md', 'shadow-none');
        this.progressBar.classList.replace('transition-all', 'transition-none');
        this.progressBar.classList.replace('w-full', 'w-0');
        this.timeouts.forEach(clearTimeout); // Clear all timeouts

        // Remove the alert from the DOM after the animation
        setTimeout(() => this.alert.remove(), 500);
    }
}

// Helper function to create a new alert
export function showAlert(type, title, message) {
    new Alert(type, title, message, document.querySelector('aside'));
}

// Optional: Default export
export default showAlert;

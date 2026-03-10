let state = {
    fromAirport: null,
    toAirport: null,
    departureDate: null,
    returnDate: null,
    adults: 1,
    kids: 0,
    transportType: 'Flight'
};

function initSearchableSelect(id) {
    const container = document.getElementById(id);
    const trigger = container.querySelector('.select-trigger');
    const dropdown = container.querySelector('.select-dropdown');
    const searchInput = container.querySelector('.select-search');
    const list = container.querySelector('.select-list');
    const valueSpan = container.querySelector('.select-value');
    
    let isOpen = false;
    
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        isOpen = !isOpen;
        dropdown.style.display = isOpen ? 'block' : 'none';
        if (isOpen) {
            searchInput.focus();
        }
    });
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        
        if (query) {
            // TODO: Replace with API call to your database
            
            list.innerHTML = '<div class="select-empty">Connect to database here</div>';
        } else {
            list.innerHTML = '';
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            dropdown.style.display = 'none';
            isOpen = false;
            searchInput.value = '';
            list.innerHTML = '';
        }
    });
}

function initDatePicker(id) {
    const container = document.getElementById(id);
    const trigger = container.querySelector('.select-trigger');
    const dropdown = container.querySelector('.date-dropdown');
    const monthYearSpan = container.querySelector('.date-month-year');
    const calendar = container.querySelector('.date-calendar');
    const valueSpan = container.querySelector('.select-value');
    
    let isOpen = false;
    let currentDate = new Date();
    let selectedDate = null;
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    
    function formatDate(date) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
    
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        monthYearSpan.textContent = `${monthNames[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let html = '';
        
        // Add day names
        dayNames.forEach(day => {
            html += `<div class="date-day-name">${day}</div>`;
        });
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="date-day empty"></div>';
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            date.setHours(0, 0, 0, 0);
            
            let classes = 'date-day';
            
            // Disable past dates
            if (date < today) {
                classes += ' disabled';
            }
            
            // Mark today
            if (date.getTime() === today.getTime()) {
                classes += ' today';
            }
            
            // Mark selected date
            if (selectedDate && date.getTime() === selectedDate.getTime()) {
                classes += ' selected';
            }
            
            html += `<div class="${classes}" data-date="${date.getTime()}">${day}</div>`;
        }
        
        calendar.innerHTML = html;
        
        // Add click handlers to day cells
        calendar.querySelectorAll('.date-day:not(.disabled):not(.empty)').forEach(dayCell => {
            dayCell.addEventListener('click', () => {
                const timestamp = parseInt(dayCell.dataset.date);
                selectedDate = new Date(timestamp);
                
                valueSpan.textContent = formatDate(selectedDate);
                valueSpan.classList.remove('placeholder');
                
                if (id === 'departurePicker') {
                    state.departureDate = selectedDate;
                } else if (id === 'returnPicker') {
                    state.returnDate = selectedDate;
                }
                
                dropdown.style.display = 'none';
                isOpen = false;
            });
        });
        
        lucide.createIcons();
    }
    
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        isOpen = !isOpen;
        dropdown.style.display = isOpen ? 'block' : 'none';
        if (isOpen) {
            renderCalendar();
        }
    });
    
    const prevBtn = container.querySelector('[data-action="prev-month"]');
    const nextBtn = container.querySelector('[data-action="next-month"]');
    
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            dropdown.style.display = 'none';
            isOpen = false;
        }
    });
}

function initPassengerCounter() {
    const trigger = document.getElementById('passengerTrigger');
    const dropdown = document.getElementById('passengerDropdown');
    const valueSpan = trigger.querySelector('.select-value');
    
    const adultsCount = document.getElementById('adultsCount');
    const kidsCount = document.getElementById('kidsCount');
    
    const adultsDecrease = document.getElementById('adultsDecrease');
    const adultsIncrease = document.getElementById('adultsIncrease');
    const kidsDecrease = document.getElementById('kidsDecrease');
    const kidsIncrease = document.getElementById('kidsIncrease');
    
    let isOpen = false;
    
    function updateDisplay() {
        const total = state.adults + state.kids;
        valueSpan.textContent = `${total} ${total === 1 ? 'Passenger' : 'Passengers'}`;
        adultsCount.textContent = state.adults;
        kidsCount.textContent = state.kids;
        adultsDecrease.disabled = state.adults <= 1;
        kidsDecrease.disabled = state.kids <= 0;
    }
    
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        isOpen = !isOpen;
        dropdown.style.display = isOpen ? 'block' : 'none';
    });
    
    adultsDecrease.addEventListener('click', () => {
        if (state.adults > 1) {
            state.adults--;
            updateDisplay();
        }
    });
    
    adultsIncrease.addEventListener('click', () => {
        state.adults++;
        updateDisplay();
    });
    
    kidsDecrease.addEventListener('click', () => {
        if (state.kids > 0) {
            state.kids--;
            updateDisplay();
        }
    });
    
    kidsIncrease.addEventListener('click', () => {
        state.kids++;
        updateDisplay();
    });
    
    document.addEventListener('click', (e) => {
        if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
            isOpen = false;
        }
    });
    
    updateDisplay();
}

function initTransportType() {
    const trigger = document.getElementById('transportTrigger');
    const dropdown = document.getElementById('transportDropdown');
    const valueSpan = trigger.querySelector('.select-value');
    const icon = document.getElementById('transportIcon');
    
    let isOpen = false;
    
    const iconMap = {
        'Flight': 'plane',
        'Bus': 'bus',
        'Train': 'train'
    };
    
    function updateIcon() {
        icon.setAttribute('data-lucide', iconMap[state.transportType]);
        // Remove all existing SVG children
        while (icon.firstChild) {
            icon.removeChild(icon.firstChild);
        }
        // Recreate the icon
        lucide.createIcons();
    }
    
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        isOpen = !isOpen;
        dropdown.style.display = isOpen ? 'block' : 'none';
    });
    
    dropdown.querySelectorAll('.transport-option').forEach(option => {
        option.addEventListener('click', () => {
            const transport = option.dataset.transport;
            state.transportType = transport;
            valueSpan.textContent = transport;
            
            dropdown.querySelectorAll('.transport-option').forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
            
            updateIcon();
            dropdown.style.display = 'none';
            isOpen = false;
        });
    });
    
    document.addEventListener('click', (e) => {
        if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
            isOpen = false;
        }
    });
}

function initForm() {
    const form = document.getElementById('bookingForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        console.log('Booking Details:', {
            from: state.fromAirport,
            to: state.toAirport,
            departure: state.departureDate,
            return: state.returnDate,
            adults: state.adults,
            kids: state.kids,
            transportType: state.transportType
        });
        
        alert('Search Flights clicked! Check console for booking details.');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initSearchableSelect('fromSelect');
    initSearchableSelect('toSelect');
    initDatePicker('departurePicker');
    initDatePicker('returnPicker');
    initPassengerCounter();
    initTransportType();
    initForm();
});
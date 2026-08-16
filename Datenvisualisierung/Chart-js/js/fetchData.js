async function fetchData(url) {
  try {
    const response = await fetch(url);
    
    // Check for HTTP errors (4xx, 5xx)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    //console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch:", error);
  }
}

//fetchData();

function parseDateString(dateString) {
    // Assuming the date format is 'dd.MM.yyyy'
    const [day, month, year] = dateString.split('.');
    return new Date(`${year}-${month}-${day}`); 
  }

function makeDateString(year, month, day) {
    year ? year = year : year = '2013';
    month ? month = month : month = '06';
    day ? day = day : day = '15'; 
    return new Date(`${year}-${month}-${day}`); 
  }

function formatDateToISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

//formatDateToISO(parseDateString('01.01.2023')); // Returns '2023-01-01'

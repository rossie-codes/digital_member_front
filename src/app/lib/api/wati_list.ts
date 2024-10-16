// lib/api/wati_list.ts 

export const fetchData = async () => {
    try {
      const response = await fetch(
        'https://live-mt-server.wati.io/340353/api/v1/getContacts?pageSize=30&pageNumber=1',
        {
          method: 'GET',
          headers: {
            // 'Content-Type': 'application/json',
            // Add any required authorization headers here (e.g., 'Authorization': 'Bearer your_api_token')
            "accept": "*/*",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4MjNiYjA5Ny04YjlmLTQ1ZTEtYTNlMi0xMDk5NzY2ZTYxNmEiLCJ1bmlxdWVfbmFtZSI6Iml0QGFrYXN0dWRpby5jb20uaGsiLCJuYW1laWQiOiJpdEBha2FzdHVkaW8uY29tLmhrIiwiZW1haWwiOiJpdEBha2FzdHVkaW8uY29tLmhrIiwiYXV0aF90aW1lIjoiMDgvMzAvMjAyNCAwNDoyMTozMyIsImRiX25hbWUiOiJtdC1wcm9kLVRlbmFudHMiLCJ0ZW5hbnRfaWQiOiIzNDAzNTMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBRE1JTklTVFJBVE9SIiwiZXhwIjoyNTM0MDIzMDA4MDAsImlzcyI6IkNsYXJlX0FJIiwiYXVkIjoiQ2xhcmVfQUkifQ.gcBWlKm-ZwOGXpkSK3PENrSs8grM8lbo7PtlB9YpiY0"
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();

      console.log(data)

      return data; // Return the fetched data

    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Re-throw the error to handle it in the calling component
    }
  };
  
  // You don't need to call fetchData() here if you're only exporting it
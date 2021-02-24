import axios from 'axios';
import data from '../../public/data/test.json';


export default class CustomerService {

    getCustomersSmall() {
        return axios.get(data).then(res => res.config.url.data);
    }

    getCustomersMedium() {
        console.log("Data: ",data);
        return axios.get(data).then(res => console.log("Hel",res));
    }

    getCustomersLarge() {
        return axios.get(data).then(res => res.config.url.data);
    }

    getCustomersXLarge() {
        return axios.get(data).then(res => res.config.url.data);
    }

    getCustomers(params) {
        return axios.get('https://www.primefaces.org/data/customers', { params }).then(res => res.data)
    }
}
    

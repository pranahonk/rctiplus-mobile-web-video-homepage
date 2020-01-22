/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


import ax from 'axios';

const ADD_DATA = (newData) => {  
    return { type: 'ADD_DATA', data: newData }
} 

export default ADD_DATA
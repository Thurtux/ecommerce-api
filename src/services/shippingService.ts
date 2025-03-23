import axios from 'axios';

export const getShippingOptions = (fromZip: string, toZip: string, weight: number) => {
    // Simulação de opções de frete
    const options = [
      {
        name: 'Entrega Expressa',
        price: 49.90,
        deliveryTime: '1-2 dias úteis'
      },
      {
        name: 'Entrega Padrão',
        price: 24.90,
        deliveryTime: '3-5 dias úteis'
      },
      {
        name: 'Entrega Econômica',
        price: 14.90,
        deliveryTime: '7-10 dias úteis'
      }
    ];
  
    return options;
  };
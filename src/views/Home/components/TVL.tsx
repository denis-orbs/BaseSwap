import React, { useState, useEffect } from 'react';
import { Flex, Text } from '@pancakeswap/uikit';

const TVL = () => {
  const [formattedValue, setFormattedValue] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const response = await fetch('https://api.llama.fi/tvl/BaseSwap');
        const data = await response.json();
        // Round the data to the nearest hundred thousand
        const roundedData = Math.round(data / 100000) * 100000;
        
        // Convert to millions for display
        const displayValue = roundedData / 1000000;
        // round down the data to remove decimals
      
        console.log(roundedData)

        const formatted = `${displayValue.toFixed(2)} million`; // append 'M' for million
        setFormattedValue(formatted);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Flex
    position="relative"
    paddingX={['8px', null, null, '3rem']}
    marginX={['4px', null, null, '2rem']}
    marginTop={['2rem', null, null, '4rem']}
    flexDirection="column"
    alignItems="flex-start"
    justifyContent="flex-start"
    id="homepage-hero"
  >
    <Text
    fontSize={['1.8rem', null, null, '2.5rem']} fontWeight="900"
    color="#fff"
    >
     Total Value Locked:&nbsp;  
    </Text>
    <Text
    fontSize="4rem" fontWeight="900"
    color="#0154FD"
    >
     {formattedValue}
    </Text>
  
    </Flex>
  );
};

export default TVL;

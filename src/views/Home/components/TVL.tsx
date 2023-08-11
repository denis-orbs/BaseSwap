import React, { useState, useEffect } from 'react';
import { Flex, Text } from '@pancakeswap/uikit';
import CountUp from 'react-countup'
import 'animate.css'

const TVL = () => {
  const [numericValue, setNumericValue] = useState(0);
  const [formattedValue, setFormattedValue] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const response = await fetch('https://api.llama.fi/tvl/BaseSwap');
        const data = await response.json();
        const roundedData = Math.round(data / 100000) * 100000;
        const displayValue = Number((roundedData / 1000000).toFixed(2)); 
        setNumericValue(displayValue);  

        const formatted = `${displayValue.toFixed(2)} million`; 
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
    marginTop={['2rem', null, null, '5rem']}
    flexDirection="column"
    alignItems="flex-start"
    justifyContent="flex-start"
    id="homepage-hero"
    className="animate__animated animate__rotateInUpRight"

  >
    <Text
    fontSize={['1.8rem', null, null, '2.5rem']} fontWeight="300"
    color="#fff"
    >
     Total Value Locked:&nbsp;  
    </Text>
    <Text
    fontSize="4rem" fontWeight="500"
    color="#0154FD"
    >
      $<CountUp end={numericValue} duration={4} decimals={2} /> million
      
     {/* ${formattedValue} */}
    </Text>
  
    </Flex>
  );
};

export default TVL;

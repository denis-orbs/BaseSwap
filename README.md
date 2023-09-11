🍑

When adding a farm, if the farm is not already in the OG Masterchef, then you must add it to the filtered farm config. 
If you dont, it will prevent the staking pools from correctly gathering the aprs. 
The filtered farm config is found in state/pools/index.ts filteredFarmConfig 
must also set classic: true

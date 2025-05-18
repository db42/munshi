## Todo

- DONE Generate ITR - define schema, validate
- DONE parse form 16 form
- DONE generate first version of from information parsed from form 16
- DONE API to give JSON
- DONE perfect logic to parse information mentioned in form 16 - use own json from last year
- DONE US equity - DONE, validate the computations
- DONE handle currency format from US Equity
- DONE update period for CG gain from US Equity
- DONE handle sectionFA from US Equity
- DONE handle peak logic, conversion to INR 
- DONE documents portal -> view parsed data for each file
- DONE AY switcher
- DONE dividend document process
- DONE - redesign the system - reducer pattern for immutability
- documentportal for form-16 - 
- DONE - support AIS
- DONE India CG - CAMS
- DONE fix pdf viewer
- WIP - compare with previous return
- - DONE - Section112A - only for indian equity
- - Schedule BFLA, CYLA - done
- - number validation - ScheduleS done, ScheduleOS done, ScheduleCG - done
- - number validation - section112A - done (pending: decimal, paytm entries)
- -  validation - PartB-TI - DONE
- - scheduleCG
- - scheduleSI
- TODO support for previous ITR in the computations for sectionFA, carry forward losses etc.
- TODO verify the computations for sectionFA last return - WIP
- TODO json renderer in client and ability to update fields in json - update AL,
- TODO parse form 26AS - information like fd interest
- TODO add validation
- TODO schedule AL from previous ITR
- todo see the working of each section in UI
- how to get tax deducted from charles schwab - WIP - needs to verify
- [] add tests

Year 2025-26
- [ done 17 May] upload AIS
- [] upload form 16 once available
- [] schedule AL (how to get entries from previous ITRs)
- [] support and upload 26AS since form-16 isn't available
- [] support ITR-1
- [] download ITR offline utility once available https://www.incometax.gov.in/iec/foportal/downloads/income-tax-returns 
- [] pre-filled data from ITR

Phase 2
- agent - tax validation
- camsMFToITR: this information is also available in camsData.summary. can be used to avoid re-processing the transactions.
- [] support entering password in AIS
- [] can directly use json for AIS
- [] use https://github.com/zgrossbart/jdd/blob/main/jdd.js for diff viewer

Phase 3
- agent - tax planning
- more ITR support
- avoid following code smells and mistakes

```
let obj2 = { name: "original" };
let obj1 = obj2;
let obj3 = obj2;

obj3.name = "modified";

console.log(obj1.name); // Outputs: "modified"
console.log(obj2.name); // Outputs: "modified"
console.log(obj3.name); // Outputs: "modified"
```


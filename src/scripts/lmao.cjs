function clrEX(){
    let clrEx="";
    let superC = "rose ";
    const colorExample=["rose","red","orange","yellow","green","blue","blue","indigo","violet","grey" ,"pink"];
    const powerExample=["100","500"];
    colorExample.forEach(ClrEX)
    function ClrEX(item){
      superC = item;
      powerExample.forEach(ClrEX2)
    }
    function ClrEX2(item){
      clrEx=clrEx+"bg-"+superC+"-"+item+" ";
    }
    return clrEx;
}
console.log(clrEX());
// function to be use to generate a string to help dynamic  bg rendering :c 
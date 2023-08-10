//Chamada do pattern em tempo de execução com um delay minimo
function formatter(n, f) {
    setTimeout(function() {
        let v = patternNumber(n.value);
        if (v != n.value) {
        n.value = v;
        }
    }, 1);
}

//Aplicar um padrão ao número recebido  
function patternNumber(inpt) {
    let newNumber = inpt.replace(/\D/g, "");
    newNumber = newNumber.replace(/^0/, "");
    if (newNumber.length > 10) {
        newNumber = newNumber.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (newNumber.length > 5) {
        newNumber = newNumber.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (newNumber.length > 2) {
         newNumber = newNumber.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
    } else {
          newNumber = newNumber.replace(/^(\d*)/, "($1");
    }
    return newNumber;
}
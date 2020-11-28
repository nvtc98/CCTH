const checkLinkDie = async () => {
    console.log($("#txtCheckLink").val());
    // let a = "http://shopee.com.my/product/173109255/5038281836";
    let a = $("#txtCheckLink").val();

    try {
        const response = await axios({
            url: a,
            headers: { "Access-Control-Allow-Origin": "*" }
        })
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}

const solve = () => {
    let data = $("#txtData").val().split("\n").filter(x => x !== '');
    let ruleTemp = $("#txtRule").val().split("\n\n");
    let rule = [];
    let result = [];

    ruleTemp.forEach(x => {
        let splitter = x.split('\n');
        if (splitter.length < 2) {
            return;
        }
        let ruleInputs = splitter[0].split(',').map(x => x.trim());
        let ruleOutputs = splitter.slice(1);
        rule.push({ ruleInputs, ruleOutputs });
    });

    data.forEach(row => {
        for (let i = 0; i < rule.length; ++i) {
            let matched = true;
            rule[i].ruleInputs.forEach(x => {
                if (matched && row.toUpperCase().search(x.toUpperCase()) === -1) {
                    matched = false;
                }
            })
            if (matched) {
                result.push(rule[i].ruleOutputs[_.random(rule[i].ruleOutputs.length - 1)]);
            }
            else {
                result.push("");
            }
        }
    })
    $("#txtResult").val(result.join("\n"));
    // console.log(ruleTemp, rule,result);
}
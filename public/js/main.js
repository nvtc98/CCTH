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

const saveSession = () => {
    if (typeof (Storage) !== "undefined") {
        sessionStorage.setItem('data', $("#txtData").val());
        sessionStorage.setItem('rule', $("#txtRule").val());
        if ($('#cbMatchPhone').prop('checked')) {
            sessionStorage.setItem('matchPhone', $("#txtMatchPhone").val());
            sessionStorage.setItem('matchKeyword', $("#txtMatchKeyword").val());
        }
    } else {
        console.log("Session không được hỗ trợ");
    }
}

const saveSessionKeyword = () => {
    if (typeof (Storage) !== "undefined") {
        sessionStorage.setItem('dataKeyword1', $("#txtDataKeyword1").val());
        sessionStorage.setItem('dataKeyword2', $("#txtDataKeyword2").val());
        sessionStorage.setItem('keywordList', $("#txtKeywordList").val());
    } else {
        console.log("Session không được hỗ trợ");
    }
}

const solve = () => {
    saveSession();

    let data = $("#txtData").val().split("\n").filter(x => x !== '');
    let ruleTemp = $("#txtRule").val().split("\n\n");
    let rule = [];
    let result = [];
    let dataMatchPhone = null;
    if ($('#cbMatchPhone').prop('checked')) {
        dataMatchPhone = $("#txtMatchPhone").val().split("\n").map(x => {
            let searchPosition = x.toUpperCase().search($("#txtMatchKeyword").val().toUpperCase());
            if (searchPosition === -1) {
                return '';
            }
            return x.slice(searchPosition + $("#txtMatchKeyword").val().length);
        });
    }

    ruleTemp.forEach(x => {
        let splitter = x.split('\n');
        if (splitter.length < 2) {
            return;
        }
        let ruleInputs = splitter[0].split(',').map(x => x.trim());
        let ruleOutputs = splitter.slice(1);
        rule.push({ ruleInputs, ruleOutputs, randomOrder: 0 });
    });

    let rowIndex = 0;
    data.forEach(row => {
        let rowFound = false;
        for (let i = 0; i < rule.length; ++i) {
            let matched = true;
            rule[i].ruleInputs.forEach(x => {
                // console.log(row.toUpperCase(), "----------", x.toUpperCase(), "----------", row.toUpperCase().search(x.toUpperCase()) === -1);
                if (matched && row.toUpperCase().search(x.toUpperCase()) === -1) {
                    matched = false;
                }
            })
            if (matched) {
                // console.log("matched - luật thứ", i + 1, "                      ", row);
                let order;
                if (randomOrder) {
                    order = _.random(rule[i].ruleOutputs.length - 1);
                }
                else {
                    order = rule[i].randomOrder;
                    rule[i].randomOrder = rule[i].randomOrder < rule[i].ruleOutputs.length - 1 ? rule[i].randomOrder + 1 : 0;
                }
                let dataToPush = rule[i].ruleOutputs[order];
                if (dataMatchPhone) {
                    dataToPush += dataMatchPhone[rowIndex];
                }
                // console.log("dataToPush", dataToPush, rowIndex);
                result.push(dataToPush);
                rowFound = true;
                break;
            }
        }
        // console.log(rowFound ? "đã match" : "không có ai match");
        !rowFound && result.push("");
        ++rowIndex;
    })
    $("#txtResult").val(result.join("\n"));
    // console.log(ruleTemp, rule,result);
}

const solveKeyword = () => {
    saveSessionKeyword();

    let data1 = $("#txtDataKeyword1").val().split("\n").filter(x => x !== '');
    let data2 = $("#txtDataKeyword2").val().split("\n").filter(x => x !== '');
    const length = Math.max(data1.length, data2.length);
    let rule = $("#txtKeywordList").val().split("\n").filter(x => x !== '').map(x => x.split("\t"));
    let result = [];
    let count = 0, countMain = 0;

    for (let i = 0; i < length; ++i) {
        const row = data1[i];
        const rowAlt = data2[i];
        const ruleRow = rule[i] || [];
        ruleRow.sort().reverse();
        let keyword = "";
        for (let j = 0; j < ruleRow.length; ++j) {
            const ruleUpperCase = ruleRow[j].toUpperCase();
            const searchMain = row && row.toUpperCase().search(ruleUpperCase) !== -1;
            if (searchMain || (rowAlt && rowAlt.toUpperCase().search(ruleUpperCase) !== -1)) {
                keyword = ruleRow[j];
                searchMain && ++countMain;
                ++count;
                break;
            }
        }
        result.push(keyword);
    }

    $("#txtResultKeyword").val(result.join("\n"));

    const rate = _.round(100.0 * count / length, 2), rateMain = _.round(100.0 * countMain / length, 2);
    const statisticStr = `
                        Tổng số câu: ${length}<br/>
                        Số keyword tìm được: ${count}/${length} (${rate}%)<br/>
                        Số keyword tìm được bởi bản tự dịch: ${countMain}/${length} (${rateMain}%)<br/>
                        Số keyword tìm được bởi bản dịch shopee: ${count-countMain}/${length} (${_.round(rate - rateMain, 2)}%)<br/>
                        `;
    console.log("statisticStr", statisticStr);
    $("#txtStatisticKeyword").html(statisticStr);
}
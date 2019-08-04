export const parseReciept = (recieptData) => {
    let lineData = {};
    let variationTop = 0,
        variationBottom = 0;
    console.log(recieptData.responses);
    const data = recieptData.responses[0].textAnnotations ?
        recieptData.responses[0].textAnnotations.slice(1) :
        recieptData.responses[1].textAnnotations.slice(1);
    // Find the scewness of the first string.
    // console.log(data[2].description);
    const scwedStrinNo = data.length - 1;
    const scewness = data[scwedStrinNo].boundingPoly.vertices[0].y - data[scwedStrinNo].boundingPoly.vertices[1].y;
    // const scewness = -2
    console.log(scewness);
    const isRecieptLeftScewed = scewness > 0;
    console.log(isRecieptLeftScewed);
    data.forEach(str => {
        const y = str.boundingPoly.vertices[0].y;

        // console.log(y);
        let lineScewness;
        const line = Object.keys(lineData).find(lineNo => {
            const lineInt = parseInt(lineNo, 10);
            const lineLength = lineData[lineNo].val.length;
            const lastStringSckewness = lineData[lineNo].skewness;
            // Figure out the trend
            lineScewness = scewness;
            // console.log(lineData);
            if (lineLength > 1) {
                if (!scewness) {
                    lineScewness = (lineData[lineNo].val[0].y - lineData[lineNo].val[1].y);
                }
            }
            // console.log(lineScewness);
            if (lineScewness > 0) {
                variationTop = lineScewness * 10; //30; //scewness * 10
                variationBottom = lineScewness * 2; //6; // scewness * 2
            } else if (lineScewness < 0) {
                variationTop = lineScewness * -7; //30; //scewness * 10
                variationBottom = lineScewness * -2; //6; // scewness * 2
            }
            // console.log(variationTop);

            // console.log(lineLength);
            const lastY = parseInt(lineData[lineNo].val[lineLength - 1].y, 10);
            // console.log(lineLength);
            return (y >= (lastY - (variationTop)) && y <= (lastY + variationBottom))
        })
        // console.log(lineScewness)
        if (line) {
            const lineLength = lineData[line].length;
            // const lastY = parseInt(lineData[line].val[lineLength - 1].y, 10);

            lineData[line].val = lineData[line].val.concat([{ str: str.description, y: parseInt(y, 10) }]);
            // lineData[line].skewness = lineScewness1;
        } else {
            lineData[y] = { val: [{ str: str.description, y: y }] };
        }
    })
    const parsedLines = []
    Object.keys(lineData).map(lineNo => {
        const line = lineData[lineNo];
        const lineSkewness = line.val.some((str, index) => {
            if (index) {
                return line.val[index - 1].y - str.y;
            }
            return false;
        }) ? 1 : -1;
        // console.log(lineSkewness);
        parsedLines.push(line.val.sort((str1, str2) => str1.y === str2.y ?
            0 : str1.y > str2.y ? (1 * lineSkewness) : (-1 * lineSkewness)).map(str => str.str).join(' '))
    })
    return parsedLines;
}

export const parseRecieptLines = (lines) => {
    const data = {
        store_name: null,
        mobile: null,
        gstn: null,
        address: null,
        products: [],
        cgst: null,
        sgst: null
    };

    try {

        function getAddress() {
            var address = ''
            for (var i = 0; i < 3; i++) {
                address += lines.splice(0, 1)
            }
            data.address = address;
        }

        function getPhone() {
            data.mobile = parseInt(lines.shift().split(':')[1], 10);
        }

        const itemColumns = {
            name: {
                regex: [new RegExp('Ite(m|n) na(m|n)e', 'gi')]
            },
            price: {
                regex: [new RegExp('price', 'gi')]
            },
            qty: {
                regex: [new RegExp('(o|q)ty', 'gi')]
            },
            amount: {
                regex: [new RegExp('amount', 'gi'), new RegExp('total', 'gi')]
            }
        };

        function reach(obj) {
            const text = lines.splice(0, 1);
            return obj.regex.some(reg => reg.test(text)) ? obj.name : reach(obj);
        }

        data.store_name = lines.shift();
        getAddress();
        getPhone();
        reach(itemColumns.name)

        let isProductRow = true;
        while (isProductRow) {
            const productRow = lines.splice(0, 1)[0].trim();
            const chunks = productRow.split(" ");
            const price = chunks[chunks.length - 3]
            const product_name = chunks.slice(0, chunks.length - 3).join(' ')
            console.log(price)
            console.log(product_name)
            if (!price || !product_name) {
                isProductRow = false;
            } else {
                data.products.push({
                    product_name,
                    price
                })
            }
        }
    } catch (e) {
        console.log(e);
    }
    return data

}
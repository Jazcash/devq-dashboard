var people = [
    {name: "bob"},
    {name: "steve"},
    {name: "tim"},
    {name: "bob"},
    {name: "steve"},
    {name: "steve"}
];

function orderByOccurence(items, key){
    let keys = {};
    for (let i=0; i<items.length; ++i){
        let item = items[i];
        if (item[key] in keys){
            keys[item[key]]++;
        } else {
            keys[item[key]] = 1;
        }
    }
    return items.sort(function(a, b){
        return (keys[a[key]] < keys[b[key]]);
    });
}

console.log(orderByOccurence(people, "name"));
function ellipsisString(str="",start=0, end=8){
    return str.length > end ? str.slice(start,end) + "..." : str
}

export default ellipsisString
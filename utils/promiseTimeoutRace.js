module.exports = async (fnToWaitFor) =>{
    return Promise.race([fnToWaitFor, new Promise((resolve)=>{
        setTimeout(()=>{
            resolve([])
        }, 10000)
    })])
    
}
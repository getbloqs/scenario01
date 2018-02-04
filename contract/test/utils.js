module.exports = {

    unixNow : (number = 0) => {
        return Math.floor( ((new Date()).getTime() / 1000) + (number) );
    } ,

    wait : (seconds) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => { resolve(); }, (seconds * 1000));
        });
    }

};
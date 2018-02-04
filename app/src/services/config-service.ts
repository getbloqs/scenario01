export class ConfigService {

    getConfig() : Promise<any> {
        return new Promise((resolve, reject) => {
            fetch('contract.config.json')
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                }).then(response => {
                    resolve(response);
                });
        });
    }

    getAbi(filename:string) : Promise<any> {
        return new Promise((resolve, reject) => {
            fetch('contracts/' + filename + '.json')
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                }).then(response => {
                    resolve(response.abi);
                });
        });
    }

}

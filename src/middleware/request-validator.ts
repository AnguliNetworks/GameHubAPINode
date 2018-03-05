export function check(key, type, customFunction?, message?) {
    return (req, res, next) => {
        const value = req.body[key];

        if (!value) {
            res.status(400).send({ error: `Missing parameter ${key}` });
            return;
        }

        let regex;

        switch (type) {
            case 'mail':
                regex = /^[_A-Za-z0-9]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/;
                break;
            case 'username':
                regex = /^[a-zA-Z0-9_.-]{3,32}$/;
                break;
            case 'password':
                regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d!-}ä-üÄ-Üß §]{8,}$/;
                break;
            default:
                res.status(500).send({ error: `Parameter type ${type} not found.` });
                return;
        }

        if (!regex.test(value)) {
            res.status(400).send({ error: `Invalid format for ${key}. Please use a valid ${type} format` });
            return;
        }

        if (customFunction) {
            customFunction(value, { req, res })
                .then((result) => {
                    if (result) {
                        next();
                        return;
                    }
                    res.status(400).send({ error: message ? message : 'Failed custom validation' });
                })
                .catch(error => res.status(500).send({ error }));
            return;
        }

        next();
    };
}

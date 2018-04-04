export function check(key, type, customFunction?, message?) {
    return (req, res, next) => {
        const value = req.body[key] || req.query[key] || req.params[key];

        if (!value) {
            res.status(400).send({ error: `Der Paramater ${key} fehlt.` });
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
            case 'int':
                regex = /^(-?)\d+$/;
                break;
            case 'none':
                regex = /.*/;
                break;
            default:
                res.status(500).send({ error: `Parametertyp ${type} nicht gefunden. Bitte kontaktiere den Support.` });
                return;
        }

        if (!regex.test(value)) {
            res.status(400).send({ error: `Ungültiges Format. Das Feld '${key}' braucht ein '${type}'-Format` });
            return;
        }

        if (customFunction) {
            customFunction(value, { req, res })
                .then((result) => {
                    if (result) {
                        next();
                        return;
                    }
                    res.status(400).send({ error: message ? message : 'Eine Validation ist fehlgeschlagen. Bitte kontaktiere den Support.' });
                })
                .catch((error) => {
                    if (typeof error === 'object') {
                        res.status(error.code).json({ error: error.message });
                    } else {
                        res.status(400).send({ error });
                    }
                });
            return;
        }

        next();
    };
}

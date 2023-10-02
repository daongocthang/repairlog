const download = (req, res) => {
    const fileName = req.query.file;
    const storagePath = __basedir + '/assets/';

    res.download(storagePath + fileName, fileName, (er) => {
        if (er) {
            res.status(500).send({ message: 'Could not download a pattern file ' + er, type: 'error' });
        }
    });
};

export default { download };

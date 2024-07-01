import Twig from 'twig';
import fs from 'fs';

require.extensions['.twig'] = function (module, filename) {
	module.exports = fs.readFileSync(filename, 'utf8');
};

// @ts-ignore
import data from './forgot-password.html.twig';

export default Twig.twig({
	data,
});

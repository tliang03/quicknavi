import init from './server/init';
export default function (kibana) {
    return new kibana.Plugin({
        require: ['elasticsearch'],

        uiExports: {
            app: {
                title: 'Quick Navigation',
                description: 'Dashboard Quick Navigation',
                main: `plugins/quicknavi/app`,
                icon: `plugins/quicknavi/rank.png`
            }
        },

        init(server) {
          init(server)
        }

    });
}

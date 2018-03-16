import init from './server/init';
export default function (kibana) {
    return new kibana.Plugin({
        require: ['elasticsearch'],

        uiExports: {
            app: {
              title: 'Quick Navigation',
              description: 'Dashboard Quick Navigation',
              main: `plugins/quicknavi/app`,
              icon: `plugins/quicknavi/rank.png`,
              injectVars(server) {
                const xpack = server.plugins.xpack_main;
                return {
                  hasXpackInstalled: !!xpack
                };
              }
            }
        },

        config(Joi) {
          const { array, boolean, number, object, string } = Joi;

          return object({
            enabled: boolean().default(true),
            get_username_from_session: object({
              enabled: boolean().default(false),
              key: string().default('username')
            }).default()
          }).default();
        },

        init(server) {
          init(server)
        }

    });
}

const TXPlugin = {
  // The install method is all that needs to exist on the plugin object.
  // It takes the global Vue object as well as user-defined options.
    install(Vue, options) {
        // 1. add global method or property
        Vue.myGlobalMethod = function () {
            // something logic ...
        }
        // 2. add a global asset
        Vue.directive('my-directive', {
            bind (el, binding, vnode, oldVnode) {
            // something logic ...
            }
        })
        // 3. inject some component options
        Vue.mixin({
            created() {
            // something logic ...
            },
            mounted() {                
                // console.log('Mounted!');
            } 
        })
        // 4. add an instance method
        Vue.prototype.$myMethod = function (methodOptions) {
            // something logic ...
        }
    }
};

export default TXPlugin;
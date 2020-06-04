let Error404 = { 
    render: async () => {
        let view = /*HTML*/`
                    <section class="error">
                        <h1>Error 404. Not fount</h1>
                    </section> 
                    `
        return view;
    },
    after_render: async () => {
        
    }
}

export default Error404;
const express = require('express')
const axios = require('axios')
const cors = require('cors')

const NOMINATUM = "https://nominatim.openstreetmap.org/search.php?city=Tsaralalana&country=Madagascar&polygon_geojson=1&format=jsonv2"
const PORT = process.env.PORT || 5001
const app = express()

app.use(express.json())
app.use(cors())

/**
 * @description Récupérer Fide id et nom d'un joueur
 */

app.get('/api.mapgasy/:quarter_name', (req, res)=>{
    let { quarter_name } = req.params
    let country = "Madagascar"
    let quarter_list = []
    axios.get(`https://nominatim.openstreetmap.org/search.php?city=${quarter_name}&country=${country}&polygon_geojson=1&format=jsonv2`)
        .then(result => {
            result.data.forEach(element => {
                let data = element.display_name

                // Conversion en tableau
                data = data.split(',')

                // Vérifier la taille du tableau pour avoir les bons données
                if(data.length < 7 && data.length > 4){
                    let [quartier, ville, region, province] = data
    
                    quarter_list.push({
                        province,
                        region,
                        ville,
                        quartier
                        
                    })
                }
                
            });
        })
        .then(result => {
            if(quarter_list.length != 0){
                res.json(quarter_list)
            }
            else{
                res.status(404).json({"détail":"Veuillez saisir un endroit qui existe ."})
            }
        })
        .catch(error => console.log(error))


})

/**
 * @description Lancement du serveur
 */
app.listen(PORT, (req, res) => {
    console.log(`Server is listenning to port ${PORT}`)

})

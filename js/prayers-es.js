// Sacred Rosary - Spanish Prayer Data
const PRAYERS_ES = {
    // Basic prayers
    signOfCross: {
        title: "La Señal de la Cruz",
        instructions: "Comience haciendo la Señal de la Cruz",
        text: "En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.",
        audio: "prayers/es/sign_of_cross.mp3",
        duration: 5000 // Estimated audio duration in ms
    },
    apostlesCreed: {
        title: "El Credo de los Apóstoles",
        instructions: "Recite el Credo de los Apóstoles",
        text: "Creo en Dios, Padre todopoderoso, Creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo, nació de Santa María Virgen, padeció bajo el poder de Poncio Pilato, fue crucificado, muerto y sepultado, descendió a los infiernos, al tercer día resucitó de entre los muertos, subió a los cielos y está sentado a la derecha de Dios, Padre todopoderoso. Desde allí ha de venir a juzgar a vivos y muertos. Creo en el Espíritu Santo, la santa Iglesia católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y la vida eterna. Amén.",
        audio: "prayers/es/apostles_creed.mp3",
        duration: 30000
    },
    ourFather: {
        title: "Padre Nuestro",
        instructions: "Recite la oración del Padre Nuestro",
        text: "Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén.",
        audio: "prayers/es/our_father.mp3",
        duration: 20000
    },
    hailMary: {
        title: "Ave María",
        instructions: "Recite la oración del Ave María",
        text: "Dios te salve, María, llena eres de gracia, el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.",
        audio: "prayers/es/hail_mary.mp3",
        duration: 15000
    },
    gloryBe: {
        title: "Gloria",
        instructions: "Recite la oración del Gloria",
        text: "Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.",
        audio: "prayers/es/glory_be.mp3",
        duration: 10000
    },
    fatimaPrayer: {
        title: "Oración de Fátima",
        instructions: "Recite la Oración de Fátima",
        text: "Oh Jesús mío, perdona nuestros pecados, líbranos del fuego del infierno, lleva al cielo a todas las almas, especialmente a las más necesitadas de tu misericordia.",
        audio: "prayers/es/fatima_prayer.mp3",
        duration: 10000
    },
    hailHolyQueen: {
        title: "Salve Regina",
        instructions: "Concluye con la oración de la Salve Regina",
        text: "Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra; Dios te salve. A Ti llamamos los desterrados hijos de Eva; a Ti suspiramos, gimiendo y llorando, en este valle de lágrimas. Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos; y después de este destierro muéstranos a Jesús, fruto bendito de tu vientre. ¡Oh clemente, oh piadosa, oh dulce Virgen María! Ruega por nosotros, Santa Madre de Dios, para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo.",
        audio: "prayers/es/hail_holy_queen.mp3",
        duration: 25000
    },
    finalPrayer: {
        title: "Oración Final",
        instructions: "Termine con la oración final",
        text: "Oremos. Oh Dios, cuyo Hijo Unigénito, con su vida, muerte y resurrección, nos ha merecido el premio de la vida eterna; concédenos, te suplicamos, que meditando estos misterios del Santísimo Rosario de la Bienaventurada Virgen María, imitemos lo que contienen y consigamos lo que prometen. Por el mismo Cristo nuestro Señor. Amén.",
        audio: "prayers/es/closing_prayer.mp3",
        duration: 20000
    }
};

// Mysteries data
const MYSTERIES_ES = {
    joyful: [
        {
            title: "La Anunciación",
            description: "El Ángel Gabriel anuncia a María que será la Madre de Dios.",
            fruits: "Fruto del Misterio: Humildad",
            scripture: "El ángel Gabriel fue enviado por Dios a una ciudad de Galilea, llamada Nazaret, a una virgen desposada con un hombre llamado José, de la casa de David; el nombre de la virgen era María. Y entrando, le dijo: \"Alégrate, llena de gracia, el Señor está contigo.\" (Lucas 1:26-28)",
            audio: "mysteries/es/joyful_1.mp3",
            duration: 20000
        },
        {
            title: "La Visitación",
            description: "María visita a su prima Isabel, que está embarazada de Juan el Bautista.",
            fruits: "Fruto del Misterio: Amor al Prójimo",
            scripture: "En aquellos días, María se levantó y fue con prontitud a la región montañosa, a una ciudad de Judá; entró en casa de Zacarías y saludó a Isabel. Y sucedió que, en cuanto oyó Isabel el saludo de María, saltó de gozo el niño en su seno, e Isabel quedó llena del Espíritu Santo; y exclamando a voz en grito, dijo: \"Bendita tú entre las mujeres y bendito el fruto de tu vientre.\" (Lucas 1:39-42)",
            audio: "mysteries/es/joyful_2.mp3",
            duration: 20000
        },
        {
            title: "El Nacimiento de Jesús",
            description: "María da a luz a Jesús en un establo en Belén.",
            fruits: "Fruto del Misterio: Pobreza, Desapego",
            scripture: "Y sucedió que, mientras ellos estaban allí, se le cumplieron los días del alumbramiento, y dio a luz a su hijo primogénito, le envolvió en pañales y le acostó en un pesebre, porque no tenían sitio en el alojamiento. (Lucas 2:6-7)",
            audio: "mysteries/es/joyful_3.mp3",
            duration: 20000
        },
        {
            title: "La Presentación en el Templo",
            description: "María y José presentan a Jesús en el Templo.",
            fruits: "Fruto del Misterio: Obediencia",
            scripture: "Cuando se cumplieron los días de la purificación de ellos, según la Ley de Moisés, llevaron a Jesús a Jerusalén para presentarle al Señor, como está escrito en la Ley del Señor: Todo varón primogénito será consagrado al Señor. (Lucas 2:22-23)",
            audio: "mysteries/es/joyful_4.mp3",
            duration: 20000
        },
        {
            title: "El Niño Jesús Perdido y Hallado en el Templo",
            description: "Después de tres días, María y José encuentran al joven Jesús enseñando en el Templo.",
            fruits: "Fruto del Misterio: Alegría en Encontrar a Jesús",
            scripture: "Al cabo de tres días, le encontraron en el Templo sentado en medio de los maestros, escuchándoles y preguntándoles; todos los que le oían, estaban estupefactos por su inteligencia y sus respuestas. (Lucas 2:46-47)",
            audio: "mysteries/es/joyful_5.mp3",
            duration: 20000
        }
    ],
    sorrowful: [
        {
            title: "La Agonía en el Huerto",
            description: "Jesús ora en el Huerto de Getsemaní la noche antes de su muerte.",
            fruits: "Fruto del Misterio: Dolor por el Pecado, Conformidad con la Voluntad de Dios",
            scripture: "Y sumido en agonía, insistía más en su oración. Su sudor se hizo como gotas espesas de sangre que caían en tierra. (Lucas 22:44)",
            audio: "mysteries/es/sorrowful_1.mp3",
            duration: 20000
        },
        {
            title: "La Flagelación",
            description: "Jesús es azotado por orden de Poncio Pilato.",
            fruits: "Fruto del Misterio: Mortificación, Pureza",
            scripture: "Pilato entonces tomó a Jesús y mandó azotarle. (Juan 19:1)",
            audio: "mysteries/es/sorrowful_2.mp3",
            duration: 20000
        },
        {
            title: "La Coronación de Espinas",
            description: "Jesús es burlado y coronado con espinas.",
            fruits: "Fruto del Misterio: Valor Moral",
            scripture: "Le desnudaron y le echaron encima un manto de púrpura; y, trenzando una corona de espinas, se la pusieron sobre su cabeza, y en su mano derecha una caña; y doblando la rodilla delante de él, le hacían burla diciendo: '¡Salve, Rey de los judíos!' (Mateo 27:28-29)",
            audio: "mysteries/es/sorrowful_3.mp3",
            duration: 20000
        },
        {
            title: "Jesús con la Cruz a Cuestas",
            description: "Jesús carga con su cruz hasta el Calvario.",
            fruits: "Fruto del Misterio: Paciencia",
            scripture: "Tomaron, pues, a Jesús, y él cargando con su cruz, salió hacia el lugar llamado Calvario, que en hebreo se llama Gólgota. (Juan 19:17)",
            audio: "mysteries/es/sorrowful_4.mp3",
            duration: 20000
        },
        {
            title: "La Crucifixión",
            description: "Jesús es clavado en la cruz y muere después de tres horas de agonía.",
            fruits: "Fruto del Misterio: Perseverancia",
            scripture: "Llegados al lugar llamado Calvario, le crucificaron allí a él y a los malhechores, uno a la derecha y otro a la izquierda. Jesús decía: 'Padre, perdónales, porque no saben lo que hacen.' (Lucas 23:33-34)",
            audio: "mysteries/es/sorrowful_5.mp3",
            duration: 20000
        }
    ],
    glorious: [
        {
            title: "La Resurrección",
            description: "Jesús resucita de entre los muertos tres días después de su crucifixión.",
            fruits: "Fruto del Misterio: Fe",
            scripture: "El primer día de la semana, muy de mañana, fueron al sepulcro llevando los aromas que habían preparado. Pero encontraron que la piedra había sido retirada del sepulcro, y entrando, no hallaron el cuerpo del Señor Jesús. (Lucas 24:1-3)",
            audio: "mysteries/es/glorious_1.mp3",
            duration: 20000
        },
        {
            title: "La Ascensión",
            description: "Jesús asciende al Cielo cuarenta días después de su resurrección.",
            fruits: "Fruto del Misterio: Esperanza, Deseo del Cielo",
            scripture: "Y dicho esto, fue levantado en presencia de ellos, y una nube le ocultó a sus ojos. (Hechos 1:9)",
            audio: "mysteries/es/glorious_2.mp3",
            duration: 20000
        },
        {
            title: "La Venida del Espíritu Santo",
            description: "El Espíritu Santo desciende sobre María y los Apóstoles.",
            fruits: "Fruto del Misterio: Sabiduría, Amor de Dios",
            scripture: "De repente vino del cielo un ruido como el de una ráfaga de viento impetuoso, que llenó toda la casa en la que se encontraban. Se les aparecieron unas lenguas como de fuego que se repartieron y se posaron sobre cada uno de ellos; quedaron todos llenos del Espíritu Santo. (Hechos 2:2-4)",
            audio: "mysteries/es/glorious_3.mp3",
            duration: 20000
        },
        {
            title: "La Asunción de María",
            description: "Al final de su vida, María es llevada en cuerpo y alma al Cielo.",
            fruits: "Fruto del Misterio: Gracia de una Buena Muerte",
            scripture: "Por eso desde ahora todas las generaciones me llamarán bienaventurada, porque ha hecho en mi favor cosas grandes el Poderoso, Santo es su nombre. (Lucas 1:48-49)",
            audio: "mysteries/es/glorious_4.mp3",
            duration: 20000
        },
        {
            title: "La Coronación de María",
            description: "María es coronada como Reina del Cielo y de la Tierra.",
            fruits: "Fruto del Misterio: Confianza en la Intercesión de María",
            scripture: "Una gran señal apareció en el cielo: una Mujer, vestida del sol, con la luna bajo sus pies, y una corona de doce estrellas sobre su cabeza. (Apocalipsis 12:1)",
            audio: "mysteries/es/glorious_5.mp3",
            duration: 20000
        }
    ],
    luminous: [
        {
            title: "El Bautismo en el Jordán",
            description: "Jesús es bautizado por Juan en el río Jordán.",
            fruits: "Fruto del Misterio: Apertura al Espíritu Santo",
            scripture: "Y cuando Jesús fue bautizado, salió luego del agua; y he aquí los cielos le fueron abiertos, y vio al Espíritu de Dios que descendía como paloma, y venía sobre él. Y hubo una voz de los cielos, que decía: 'Este es mi Hijo amado, en quien tengo complacencia.' (Mateo 3:16-17)",
            audio: "mysteries/es/luminous_1.mp3",
            duration: 20000
        },
        {
            title: "Las Bodas de Caná",
            description: "Jesús realiza su primer milagro en las bodas de Caná.",
            fruits: "Fruto del Misterio: A Jesús por María",
            scripture: "Su madre dijo a los sirvientes: 'Haced lo que él os diga.' (Juan 2:5)",
            audio: "mysteries/es/luminous_2.mp3",
            duration: 20000
        },
        {
            title: "El Anuncio del Reino de Dios",
            description: "Jesús proclama el Reino de Dios y llama a todos a la conversión.",
            fruits: "Fruto del Misterio: Arrepentimiento, Confianza en Dios",
            scripture: "El tiempo se ha cumplido y el Reino de Dios está cerca; convertíos y creed en el Evangelio. (Marcos 1:15)",
            audio: "mysteries/es/luminous_3.mp3",
            duration: 20000
        },
        {
            title: "La Transfiguración",
            description: "Jesús se transfigura en el Monte Tabor.",
            fruits: "Fruto del Misterio: Deseo de Santidad",
            scripture: "Y se transfiguró delante de ellos, y resplandeció su rostro como el sol, y sus vestidos se hicieron blancos como la luz. (Mateo 17:2)",
            audio: "mysteries/es/luminous_4.mp3",
            duration: 20000
        },
        {
            title: "La Institución de la Eucaristía",
            description: "Jesús instituye la Eucaristía en la Última Cena.",
            fruits: "Fruto del Misterio: Adoración",
            scripture: "Y tomando pan, después de haber dado gracias, lo partió y les dio, diciendo: 'Esto es mi cuerpo, que por vosotros es dado; haced esto en memoria de mí.' (Lucas 22:19)",
            audio: "mysteries/es/luminous_5.mp3",
            duration: 20000
        }
    ]
};

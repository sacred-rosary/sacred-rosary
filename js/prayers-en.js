// Sacred Rosary - English Prayer Data
const PRAYERS_EN = {
    // Basic prayers
    signOfCross: {
        title: "The Sign of the Cross",
        instructions: "Begin by making the Sign of the Cross",
        text: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
        audio: "prayers/en/sign_of_cross.mp3",
        duration: 5000 // Estimated audio duration in ms
    },
    apostlesCreed: {
        title: "The Apostles' Creed",
        instructions: "Recite the Apostles' Creed",
        text: "I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, His only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; He descended into hell; on the third day He rose again from the dead; He ascended into heaven, and is seated at the right hand of God the Father almighty; from there He will come to judge the living and the dead. I believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.",
        audio: "prayers/en/apostles_creed.mp3",
        duration: 30000
    },
    ourFather: {
        title: "Our Father",
        instructions: "Recite the Our Father prayer",
        text: "Our Father, who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.",
        audio: "prayers/en/our_father.mp3",
        duration: 20000
    },
    hailMary: {
        title: "Hail Mary",
        instructions: "Recite the Hail Mary prayer",
        text: "Hail Mary, full of grace. The Lord is with thee. Blessed art thou amongst women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",
        audio: "prayers/en/hail_mary.mp3",
        duration: 15000
    },
    gloryBe: {
        title: "Glory Be",
        instructions: "Recite the Glory Be prayer",
        text: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.",
        audio: "prayers/en/glory_be.mp3",
        duration: 10000
    },
    fatimaPrayer: {
        title: "Fatima Prayer",
        instructions: "Recite the Fatima Prayer",
        text: "O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to Heaven, especially those in most need of Thy mercy.",
        audio: "prayers/en/fatima_prayer.mp3",
        duration: 10000
    },
    hailHolyQueen: {
        title: "Hail, Holy Queen",
        instructions: "Conclude with the Hail, Holy Queen prayer",
        text: "Hail, holy Queen, Mother of mercy, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn, then, most gracious advocate, thine eyes of mercy toward us, and after this, our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary. Pray for us, O holy Mother of God. That we may be made worthy of the promises of Christ.",
        audio: "prayers/en/hail_holy_queen.mp3",
        duration: 25000
    },
    finalPrayer: {
        title: "Closing Prayer",
        instructions: "Finish with the closing prayer",
        text: "Let us pray. O God, whose Only Begotten Son, by his life, Death, and Resurrection, has purchased for us the rewards of eternal life, grant, we beseech thee, that while meditating on these mysteries of the most holy Rosary of the Blessed Virgin Mary, we may imitate what they contain and obtain what they promise, through the same Christ our Lord. Amen.",
        audio: "prayers/en/closing_prayer.mp3",
        duration: 20000
    }
};

// Mysteries data
const MYSTERIES_EN = {
    joyful: [
        {
            title: "The Annunciation",
            description: "The Angel Gabriel announces to Mary that she is to be the Mother of God.",
            fruits: "Fruit of the Mystery: Humility",
            scripture: "The angel Gabriel was sent from God to a city of Galilee named Nazareth, to a virgin betrothed to a man whose name was Joseph, of the house of David; and the virgin's name was Mary. And he came to her and said, \"Hail, full of grace, the Lord is with you!\" (Luke 1:26-28)",
            audio: "mysteries/en/joyful_1.mp3",
            duration: 20000
        },
        {
            title: "The Visitation",
            description: "Mary visits her cousin Elizabeth, who is pregnant with John the Baptist.",
            fruits: "Fruit of the Mystery: Love of Neighbor",
            scripture: "In those days Mary arose and went with haste into the hill country, to a city of Judah, and she entered the house of Zechariah and greeted Elizabeth. And when Elizabeth heard the greeting of Mary, the babe leaped in her womb; and Elizabeth was filled with the Holy Spirit and she exclaimed with a loud cry, \"Blessed are you among women, and blessed is the fruit of your womb!\" (Luke 1:39-42)",
            audio: "mysteries/en/joyful_2.mp3",
            duration: 20000
        },
        {
            title: "The Nativity",
            description: "Mary gives birth to Jesus in a stable in Bethlehem.",
            fruits: "Fruit of the Mystery: Poverty, Detachment",
            scripture: "And while they were there, the time came for her to be delivered. And she gave birth to her first-born son and wrapped him in swaddling cloths, and laid him in a manger, because there was no place for them in the inn. (Luke 2:6-7)",
            audio: "mysteries/en/joyful_3.mp3",
            duration: 20000
        },
        {
            title: "The Presentation in the Temple",
            description: "Mary and Joseph present Jesus in the Temple.",
            fruits: "Fruit of the Mystery: Obedience",
            scripture: "And when the time came for their purification according to the law of Moses, they brought him up to Jerusalem to present him to the Lord (as it is written in the law of the Lord, \"Every male that opens the womb shall be called holy to the Lord\"). (Luke 2:22-23)",
            audio: "mysteries/en/joyful_4.mp3",
            duration: 20000
        },
        {
            title: "The Finding of Jesus in the Temple",
            description: "After three days, Mary and Joseph find the young Jesus teaching in the Temple.",
            fruits: "Fruit of the Mystery: Joy in Finding Jesus",
            scripture: "After three days they found him in the temple, sitting among the teachers, listening to them and asking them questions; and all who heard him were amazed at his understanding and his answers. (Luke 2:46-47)",
            audio: "mysteries/en/joyful_5.mp3",
            duration: 20000
        }
    ],
    sorrowful: [
        {
            title: "The Agony in the Garden",
            description: "Jesus prays in the Garden of Gethsemane on the night before His death.",
            fruits: "Fruit of the Mystery: Sorrow for Sin, Conformity to God's Will",
            scripture: "And being in agony he prayed more earnestly; and his sweat became like great drops of blood falling down upon the ground. (Luke 22:44)",
            audio: "mysteries/en/sorrowful_1.mp3",
            duration: 20000
        },
        {
            title: "The Scourging at the Pillar",
            description: "Jesus is scourged at the pillar by order of Pontius Pilate.",
            fruits: "Fruit of the Mystery: Mortification, Purity",
            scripture: "Then Pilate took Jesus and scourged him. (John 19:1)",
            audio: "mysteries/en/sorrowful_2.mp3",
            duration: 20000
        },
        {
            title: "The Crowning with Thorns",
            description: "Jesus is mocked and crowned with thorns.",
            fruits: "Fruit of the Mystery: Moral Courage",
            scripture: "And they stripped him and put a scarlet robe upon him, and plaiting a crown of thorns they put it on his head, and put a reed in his right hand. And kneeling before him they mocked him, saying, \"Hail, King of the Jews!\" (Matthew 27:28-29)",
            audio: "mysteries/en/sorrowful_3.mp3",
            duration: 20000
        },
        {
            title: "The Carrying of the Cross",
            description: "Jesus carries His cross to Calvary.",
            fruits: "Fruit of the Mystery: Patience",
            scripture: "So they took Jesus, and he went out, bearing his own cross, to the place called the place of a skull, which is called in Hebrew Golgotha. (John 19:17)",
            audio: "mysteries/en/sorrowful_4.mp3",
            duration: 20000
        },
        {
            title: "The Crucifixion",
            description: "Jesus is nailed to the cross and dies after three hours of agony.",
            fruits: "Fruit of the Mystery: Perseverance",
            scripture: "And when they came to the place which is called The Skull, there they crucified him, and the criminals, one on the right and one on the left. And Jesus said, \"Father, forgive them; for they know not what they do.\" (Luke 23:33-34)",
            audio: "mysteries/en/sorrowful_5.mp3",
            duration: 20000
        }
    ],
    glorious: [
        {
            title: "The Resurrection",
            description: "Jesus rises from the dead three days after His crucifixion.",
            fruits: "Fruit of the Mystery: Faith",
            scripture: "But on the first day of the week, at early dawn, they went to the tomb, taking the spices which they had prepared. And they found the stone rolled away from the tomb, but when they went in they did not find the body of the Lord Jesus. (Luke 24:1-3)",
            audio: "mysteries/en/glorious_1.mp3",
            duration: 20000
        },
        {
            title: "The Ascension",
            description: "Jesus ascends into Heaven forty days after His resurrection.",
            fruits: "Fruit of the Mystery: Hope, Desire for Heaven",
            scripture: "And when he had said this, as they were looking on, he was lifted up, and a cloud took him out of their sight. (Acts 1:9)",
            audio: "mysteries/en/glorious_2.mp3",
            duration: 20000
        },
        {
            title: "The Descent of the Holy Spirit",
            description: "The Holy Spirit descends upon Mary and the Apostles.",
            fruits: "Fruit of the Mystery: Wisdom, Love of God",
            scripture: "And suddenly a sound came from heaven like the rush of a mighty wind, and it filled all the house where they were sitting. And there appeared to them tongues as of fire, distributed and resting on each one of them. And they were all filled with the Holy Spirit. (Acts 2:2-4)",
            audio: "mysteries/en/glorious_3.mp3",
            duration: 20000
        },
        {
            title: "The Assumption of Mary",
            description: "At the end of her life, Mary is taken body and soul into Heaven.",
            fruits: "Fruit of the Mystery: Grace of a Happy Death",
            scripture: "For behold, henceforth all generations will call me blessed; for he who is mighty has done great things for me, and holy is his name. (Luke 1:48-49)",
            audio: "mysteries/en/glorious_4.mp3",
            duration: 20000
        },
        {
            title: "The Coronation of Mary",
            description: "Mary is crowned Queen of Heaven and Earth.",
            fruits: "Fruit of the Mystery: Trust in Mary's Intercession",
            scripture: "And a great portent appeared in heaven, a woman clothed with the sun, with the moon under her feet, and on her head a crown of twelve stars. (Revelation 12:1)",
            audio: "mysteries/en/glorious_5.mp3",
            duration: 20000
        }
    ],
    luminous: [
        {
            title: "The Baptism in the Jordan",
            description: "Jesus is baptized by John in the Jordan River.",
            fruits: "Fruit of the Mystery: Openness to the Holy Spirit",
            scripture: "And when Jesus was baptized, he went up immediately from the water, and behold, the heavens were opened and he saw the Spirit of God descending like a dove, and alighting on him; and lo, a voice from heaven, saying, \"This is my beloved Son, with whom I am well pleased.\" (Matthew 3:16-17)",
            audio: "mysteries/en/luminous_1.mp3",
            duration: 20000
        },
        {
            title: "The Wedding at Cana",
            description: "Jesus performs His first miracle at the wedding feast in Cana.",
            fruits: "Fruit of the Mystery: To Jesus through Mary",
            scripture: "His mother said to the servants, \"Do whatever he tells you.\" (John 2:5)",
            audio: "mysteries/en/luminous_2.mp3",
            duration: 20000
        },
        {
            title: "The Proclamation of the Kingdom",
            description: "Jesus proclaims the Kingdom of God and calls all to conversion.",
            fruits: "Fruit of the Mystery: Repentance, Trust in God",
            scripture: "The time is fulfilled, and the kingdom of God is at hand; repent, and believe in the gospel. (Mark 1:15)",
            audio: "mysteries/en/luminous_3.mp3",
            duration: 20000
        },
        {
            title: "The Transfiguration",
            description: "Jesus is transfigured on Mount Tabor.",
            fruits: "Fruit of the Mystery: Desire for Holiness",
            scripture: "And he was transfigured before them, and his face shone like the sun, and his garments became white as light. (Matthew 17:2)",
            audio: "mysteries/en/luminous_4.mp3",
            duration: 20000
        },
        {
            title: "The Institution of the Eucharist",
            description: "Jesus institutes the Eucharist at the Last Supper.",
            fruits: "Fruit of the Mystery: Adoration",
            scripture: "And he took bread, and when he had given thanks he broke it and gave it to them, saying, \"This is my body which is given for you. Do this in remembrance of me.\" (Luke 22:19)",
            audio: "mysteries/en/luminous_5.mp3",
            duration: 20000
        }
    ]
};

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { Track, TrackDocument } from '../schemas/track.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { randomUUID } from 'node:crypto';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Artist.name) private artistModel: Model<ArtistDocument>,
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  async seed() {
    console.log('Start making fixtures!');
    await this.artistModel.deleteMany({});
    await this.albumModel.deleteMany({});
    await this.trackModel.deleteMany({});
    await this.userModel.deleteMany({});
    console.log('Collections of MD was cleared!');
    const [EdSheeranArtist, InnaArtist, AdeleArtist, JustinTimberlakeArtist] =
      await this.artistModel.create(
        {
          name: 'Ed Sheeran',
          description:
            'Edward Christopher Sheeran was born 17 February 1991. He is an English singer-songwriter. Born in Halifax, West Yorkshire, and raised in Framlingham, Suffolk, he began writing songs around the age of eleven. In early 2011, Sheeran independently released the extended play No. 5 Collaborations Project. He signed with Asylum Records the same year.',
          image: 'fixtures/Ed_Sheeran.jpg',
        },
        {
          name: 'Inna',
          description:
            'Elena Alexandra Apostoleanu (born 16 October 1986), known professionally as Inna, is a Romanian singer. Born in Mangalia and raised in Neptun, she studied political science at Ovidius University before meeting the Romanian trio Play & Win and pursuing a music career. She adopted the stage name "Alessandra" and a pop-rock style in 2008; later that year, she changed her stage name to "Inna" and began releasing EDM, house and popcorn music.',
          image: 'fixtures/Inna.jpg',
        },
        {
          name: 'Adele',
          description:
            'Adele Laurie Blue Adkins (born 5 May 1988), known mononymously as Adele, is an English singer-songwriter. Regarded as a British icon, she is known for her mezzo-soprano vocals and sentimental songwriting. Her accolades include 16 Grammy Awards, 12 Brit Awards (including three for British Album of the Year), an Academy Award, a Primetime Emmy Award, and a Golden Globe Award.',
          image: 'fixtures/Adele.jpg',
        },
        {
          name: 'Justin Timberlake',
          description:
            'Justin Randall Timberlake (born January 31, 1981) is an American singer, songwriter, record producer, actor, and dancer. Dubbed the "Prince of Pop", Billboard honored him as the best performing solo act on Pop Airplay and one of the Greatest Pop Stars of the 21st Century. Timberlake remains among the best-selling recording artists of all time, with sales of over 117 million records worldwide.',
          image: 'fixtures/JustinTimberlake.jpg',
        },
      );

    const [
      EditionFrancaiseAlbum,
      XAlbum,
      HotAlbum,
      ElPasadoAlbum,
      Adele21Album,
      Adele25Album,
      TheExperienceAlbum,
    ] = await this.albumModel.create(
      {
        artist: EdSheeranArtist._id,
        title: '= Édition Française',
        releaseDate: 2022,
        image: 'fixtures/L-Edition-Francaise.jpg',
      },
      {
        artist: EdSheeranArtist._id,
        title: 'X',
        releaseDate: 2014,
        image: 'fixtures/Ed_Sheeran_X.jpg',
      },
      {
        artist: InnaArtist._id,
        title: 'Hot',
        releaseDate: 2009,
        image: 'fixtures/Inna_hot.jpg',
      },
      {
        artist: InnaArtist._id,
        title: 'El Pasado',
        releaseDate: 2023,
        image: 'fixtures/ElPasado.jpg',
      },
      {
        artist: AdeleArtist._id,
        title: '21',
        releaseDate: 2011,
        image: 'fixtures/Adele21.jpg',
      },
      {
        artist: AdeleArtist._id,
        title: '25',
        releaseDate: 2015,
        image: 'fixtures/Adele25.jpg',
      },
      {
        artist: JustinTimberlakeArtist._id,
        title: 'The 20/20 Experience',
        releaseDate: 2013,
        image: 'fixtures/JT.jpeg',
      },
    );

    await this.trackModel.create(
      {
        album: EditionFrancaiseAlbum._id,
        title: 'Tides',
        trackDuration: '3:16',
      },
      {
        album: EditionFrancaiseAlbum._id,
        title: 'Shivers',
        trackDuration: '3:28',
      },
      {
        album: EditionFrancaiseAlbum._id,
        title: 'First Times',
        trackDuration: '3:06',
      },
      {
        album: EditionFrancaiseAlbum._id,
        title: 'Bad Habits',
        trackDuration: '3:51',
      },
      {
        album: EditionFrancaiseAlbum._id,
        title: '2step',
        trackDuration: '2:34',
      },
      {
        album: XAlbum._id,
        title: 'Photograph',
        trackDuration: '4:16',
      },
      {
        album: XAlbum._id,
        title: 'Bloodstream',
        trackDuration: '5:00',
      },
      {
        album: XAlbum._id,
        title: "Don't",
        trackDuration: '3:39',
      },
      {
        album: XAlbum._id,
        title: 'Thinking Out Loud',
        trackDuration: '4:37',
      },
      {
        album: XAlbum._id,
        title: 'All of the Stars',
        trackDuration: '3:57',
      },
      {
        album: HotAlbum._id,
        title: 'Hot (Play & Win Radio Version)',
        trackDuration: '3:37',
      },
      {
        album: HotAlbum._id,
        title: 'Amazing',
        trackDuration: '3:27',
      },
      {
        album: HotAlbum._id,
        title: "Don't Let the Music Die",
        trackDuration: '3:38',
      },
      {
        album: HotAlbum._id,
        title: 'Deja Vu (Play & Win Radio Edit)',
        trackDuration: '4:21',
      },
      {
        album: HotAlbum._id,
        title: 'On & On',
        trackDuration: '4:38',
      },
      {
        album: ElPasadoAlbum._id,
        title: 'Primera Vez',
        trackDuration: '2:51',
      },
      {
        album: ElPasadoAlbum._id,
        title: 'Enferma',
        trackDuration: '3:43',
      },
      {
        album: ElPasadoAlbum._id,
        title: 'Dame La Mano',
        trackDuration: '2:55',
      },
      {
        album: ElPasadoAlbum._id,
        title: 'Cora',
        trackDuration: '2:51',
      },
      {
        album: ElPasadoAlbum._id,
        title: 'LaLaLa',
        trackDuration: '2:32',
      },
      {
        album: Adele21Album._id,
        title: 'Rolling in the Deep',
        trackDuration: '3:48',
      },
      {
        album: Adele21Album._id,
        title: 'Set Fire to the Rain',
        trackDuration: '4:02',
      },
      {
        album: Adele21Album._id,
        title: 'Take It All',
        trackDuration: '3:48',
      },
      {
        album: Adele21Album._id,
        title: 'Someone Like You',
        trackDuration: '4:45',
      },
      {
        album: Adele21Album._id,
        title: 'He Won’t Go',
        trackDuration: '4:38',
      },
      {
        album: Adele25Album._id,
        title: 'Hello',
        trackDuration: '4:55',
      },
      {
        album: Adele25Album._id,
        title: 'Send My Love (To Your New Lover)',
        trackDuration: '3:43',
      },
      {
        album: Adele25Album._id,
        title: 'When We Were Young',
        trackDuration: '4:51',
      },
      {
        album: Adele25Album._id,
        title: 'Remedy',
        trackDuration: '4:05',
      },
      {
        album: Adele25Album._id,
        title: 'Water Under the Bridge',
        trackDuration: '4:00',
      },
      {
        album: TheExperienceAlbum._id,
        title: 'Strawberry Bubblegum',
        trackDuration: '8:00',
      },
      {
        album: TheExperienceAlbum._id,
        title: 'Mirrors',
        trackDuration: '8:05',
      },
      {
        album: TheExperienceAlbum._id,
        title: 'TKO',
        trackDuration: '7:04',
      },
      {
        album: TheExperienceAlbum._id,
        title: 'Take Back The Night',
        trackDuration: '5:53',
      },
    );
    await this.userModel.create(
      {
        email: 'molly@gmail.com',
        password: '123',
        role: 'admin',
        token: randomUUID(),
        displayName: 'Molly Gordon',
      },
      {
        email: 'sally@gmail.com',
        password: '123',
        role: 'user',
        token: randomUUID(),
        displayName: 'Sally Lau',
      },
    );
  }
}

import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Connectors } from 'shoukaku';
import { NRMusic, NRMusicTrack } from '../dist';

// Configuración de Lavalink y Token de Discord
const LAVALINK_HOST = 'TU_HOST_DE_LAVALINK';
const LAVALINK_PORT = 'TU_PUERTO';
const LAVALINK_PASSWORD = 'TU_CONTRASEÑA';
const LAVALINK_SECURE = false;
const DISCORD_TOKEN = 'TU_TOKEN_DE_DISCORD_AQUI';

if (!DISCORD_TOKEN) {
  console.error('Please set a valid DISCORD_TOKEN in the code');
  process.exit(1);
}

const Nodes = [
  {
    name: 'lavalink',
    url: `${LAVALINK_HOST}:${LAVALINK_PORT}`,
    auth: LAVALINK_PASSWORD,
    secure: LAVALINK_SECURE,
  },
];

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const nrmusic = new NRMusic(
  {
    defaultSearchEngine: 'youtube',
    send: (guildId: string, payload: any) => {
      const guild = client.guilds.cache.get(guildId);
      if (guild) guild.shard.send(payload);
    },
  },
  new Connectors.DiscordJS(client),
  Nodes,
);

// Define slash commands
const commands = [
  new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from YouTube or Spotify')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Song name or URL')
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song'),
  new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop the music and disconnect'),
  new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show the current queue')
].map(command => command.toJSON());

client.on('ready', async () => {
  console.log(`${client.user?.tag} Ready!`);
  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);
  try {
    console.log('Started refreshing application (/) commands...');
    await rest.put(
      Routes.applicationCommands(client.user!.id),
      { body: commands },
    );
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
});

nrmusic.shoukaku.on('ready', (name: string) => console.log(`Lavalink ${name}: Ready!`));
nrmusic.shoukaku.on('error', (name: string, error: any) => console.error(`Lavalink ${name}: Error Caught,`, error));

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (!interaction.guild || !interaction.guildId || !interaction.channelId) return;

  const { commandName } = interaction;

  // Retrieve the member who executed the command
  const member = interaction.guild.members.cache.get(interaction.user.id);
  const voiceChannel = member?.voice.channel;

  if (!voiceChannel) {
    const embed = new EmbedBuilder().setColor('Red').setDescription('❌ You need to be in a voice channel to use this command!');
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  // --- /PLAY COMMAND ---
  if (commandName === 'play') {
    await interaction.deferReply();
    const query = interaction.options.getString('query', true);

    const player = await nrmusic.createPlayer({
      guildId: interaction.guildId,
      textId: interaction.channelId,
      voiceId: voiceChannel.id,
      volume: 40,
    });

    // Check if it's a Spotify link
    const isSpotify = /https?:\/\/(?:open\.)?spotify\.com\/(?:[a-zA-Z0-9-]+\/)?(?:track|album|artist|playlist)\//i.test(query);

    if (isSpotify) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const spotify = require('spotify-url-info')(globalThis.fetch);
        const spotifyTracks = await spotify.getTracks(query);

        if (!spotifyTracks || spotifyTracks.length === 0) {
          const embed = new EmbedBuilder().setColor('Red').setDescription('❌ Could not find any tracks on that Spotify link.');
          return interaction.editReply({ embeds: [embed] });
        }

        const embed = new EmbedBuilder()
          .setColor('Green')
          .setDescription(`🎵 Fetching ${spotifyTracks.length} tracks from Spotify and matching them to YouTube... (this might take a moment for large playlists)`);
        await interaction.editReply({ embeds: [embed] });

        let firstTrackAdded = false;

        for (const sTrack of spotifyTracks) {
          const searchStr = `${sTrack.name} ${sTrack.artist || ''}`;
          const res = await nrmusic.search(searchStr, { requester: interaction.user });

          if (res.tracks.length) {
            player.queue.add(res.tracks[0]);

            if (!player.playing && !player.paused) {
              player.play();
            }

            if (!firstTrackAdded) {
              const track = res.tracks[0];
              const updateEmbed = new EmbedBuilder()
                .setColor('Green')
                .setTitle(spotifyTracks.length > 1 ? `🎵 Queued Spotify Playlist (${spotifyTracks.length} tracks)` : '🎵 Queued Spotify Song')
                .setDescription(`**[${track.title}](${track.uri || ''})**`)
                .setThumbnail(track.thumbnail || null)
                .addFields(
                  { name: 'Author', value: track.author || 'Unknown', inline: true },
                  { name: 'Duration', value: `${Math.round((track.length || 0) / 1000)}s`, inline: true }
                );
              await interaction.editReply({ embeds: [updateEmbed] });
              firstTrackAdded = true;
            }
          }
        }

        if (!firstTrackAdded) {
          const errorEmbed = new EmbedBuilder().setColor('Red').setDescription('❌ Could not find any corresponding tracks on YouTube for that Spotify link.');
          return interaction.editReply({ embeds: [errorEmbed] });
        }

        return; // done with spotify branch
      } catch (err) {
        console.error('Spotify fetch error:', err);
        const errEmbed = new EmbedBuilder().setColor('Red').setDescription('❌ Error reading the Spotify link. Make sure it is public.');
        return interaction.editReply({ embeds: [errEmbed] });
      }
    }

    // Standard YouTube / Lavalink search fallback for non-spotify queries
    const result = await nrmusic.search(query, { requester: interaction.user });
    if (!result.tracks.length) {
      const embed = new EmbedBuilder().setColor('Red').setDescription('❌ No results found!');
      return interaction.editReply({ embeds: [embed] });
    }

    if (result.type === 'PLAYLIST') {
      player.queue.add(result.tracks);
    } else {
      player.queue.add(result.tracks[0]);
    }

    if (!player.playing && !player.paused) player.play();

    const track = result.tracks[0];
    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle(result.type === 'PLAYLIST' ? `🎵 Queued Playlist: ${result.playlistName}` : '🎵 Queued Song')
      .setDescription(`**[${track.title}](${track.uri || ''})**`)
      .setThumbnail(track.thumbnail || null)
      .addFields(
        { name: 'Author', value: track.author || 'Unknown', inline: true },
        { name: 'Duration', value: `${Math.round((track.length || 0) / 1000)}s`, inline: true }
      );

    return interaction.editReply({ embeds: [embed] });
  }

  // --- /SKIP COMMAND ---
  if (commandName === 'skip') {
    const player = nrmusic.players.get(interaction.guildId);
    if (!player || !player.playing) {
      const embed = new EmbedBuilder().setColor('Red').setDescription('❌ Nothing is currently playing!');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    player.skip();
    const embed = new EmbedBuilder().setColor('Orange').setDescription('⏭️ Skipped to the next song!');
    return interaction.reply({ embeds: [embed] });
  }

  // --- /STOP COMMAND ---
  if (commandName === 'stop') {
    const player = nrmusic.players.get(interaction.guildId);
    if (!player) {
      const embed = new EmbedBuilder().setColor('Red').setDescription('❌ I am not playing in a voice channel!');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    player.destroy();
    const embed = new EmbedBuilder().setColor('Red').setDescription('🛑 Stopped music, cleared queue, and left the channel.');
    return interaction.reply({ embeds: [embed] });
  }

  // --- /QUEUE COMMAND ---
  if (commandName === 'queue') {
    const player = nrmusic.players.get(interaction.guildId);
    if (!player || (!player.playing && player.queue.length === 0)) {
      const embed = new EmbedBuilder().setColor('Red').setDescription('❌ The queue is empty!');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const nextTracks = player.queue.slice(0, 10).map((track, i) => `${i + 1}. **[${track.title}](${track.uri || ''})**`);

    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle('🎶 Current Queue')
      .setDescription(nextTracks.length > 0 ? nextTracks.join('\n') : 'No more songs in the queue.')
      .setFooter({ text: `Total queue length: ${player.queue.length} tracks` });

    return interaction.reply({ embeds: [embed] });
  }
});

client.login(DISCORD_TOKEN);

require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const BENEFICIARY = "حسام محمد الشريف";
const ACCOUNT_NUMBER = "199000010006081111003";
const IBAN = "SA18 8000 0199 6080 1111 1003";

if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID) {
  throw new Error("Missing environment variables.");
}

async function main() {
  const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    {
      body: [
        new SlashCommandBuilder()
          .setName("payment")
          .setDescription("Send SERO payment details")
          .toJSON(),
      ],
    }
  );

  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
  });

  client.on("interactionCreate", async (interaction) => {
    if (
      interaction.isChatInputCommand() &&
      interaction.commandName === "payment"
    ) {
      const embed = new EmbedBuilder()
        .setColor(0x7c3aed)
        .setTitle("💳 طريقة الدفع | SERO")
        .setDescription(
          `يرجى التحويل إلى الحساب البنكي التالي:\n\n` +
          `👤 **اسم المستفيد:** ${BENEFICIARY}\n\n` +
          `بعد التحويل، يرجى إرسال صورة إثبات الدفع لإتمام طلبك.\n\n` +
          `**شكراً لثقتكم بـ SERO 🤍**`
        )
        .setFooter({ text: "SERO PAYMENTS" });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("show_iban")
          .setLabel("عرض الآيبان")
          .setEmoji("📋")
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId("show_account")
          .setLabel("عرض رقم الحساب")
          .setEmoji("📋")
          .setStyle(ButtonStyle.Secondary)
      );

      await interaction.reply({
        embeds: [embed],
        components: [row],
      });
    }

    if (interaction.isButton() && interaction.customId === "show_iban") {
      await interaction.reply({
        content: `**الآيبان:**\n\`\`\`\n${IBAN}\n\`\`\`\nاضغط مطولاً لنسخه.`,
        ephemeral: true,
      });
    }

    if (interaction.isButton() && interaction.customId === "show_account") {
      await interaction.reply({
        content: `**رقم الحساب:**\n\`\`\`\n${ACCOUNT_NUMBER}\n\`\`\`\nاضغط مطولاً لنسخه.`,
        ephemeral: true,
      });
    }
  });

  await client.login(DISCORD_TOKEN);
}

main().catch(console.error);

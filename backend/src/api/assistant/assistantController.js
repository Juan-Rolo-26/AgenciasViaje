const assistantService = require("../../services/assistantService");

async function chatAssistant(req, res, next) {
  try {
    const { message, history } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message es obligatorio" });
    }

    const reply = await assistantService.createAssistantReply({
      message,
      history
    });
    res.json({ reply });
  } catch (error) {
    next(error);
  }
}

async function getAssistantOverview(req, res, next) {
  try {
    const data = await assistantService.fetchAssistantData();
    const reply = assistantService.buildOverviewReply(data);
    res.json({ reply });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  chatAssistant,
  getAssistantOverview
};

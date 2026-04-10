<script setup lang="ts">
import type {
  EvolutionChainNode,
  EvolutionConditions,
  EvolutionPokemon,
} from "~/types/pokemon";

const props = defineProps<{
  chain: EvolutionChainNode;
  currentId?: number;
}>();

interface Stage {
  pokemon: EvolutionPokemon;
  conditions: EvolutionConditions[];
}

const levels = computed((): Stage[][] => {
  const result: Stage[][] = [];
  function traverse(node: EvolutionChainNode, depth: number) {
    if (!result[depth]) result[depth] = [];
    result[depth].push({ pokemon: node.pokemon, conditions: node.conditions });
    node.evolvesTo.forEach((child) => traverse(child, depth + 1));
  }
  traverse(props.chain, 0);
  return result;
});

const hasEvolutions = computed(() => levels.value.length > 1);

const itemNames: Record<string, string> = {
  "fire-stone": "Pierre Feu",
  "water-stone": "Pierre Eau",
  "thunder-stone": "Pierre Foudre",
  "leaf-stone": "Pierre Plante",
  "moon-stone": "Pierre Lune",
  "sun-stone": "Pierre Soleil",
  "shiny-stone": "Pierre Éclat",
  "dusk-stone": "Pierre Nuit",
  "dawn-stone": "Pierre Aube",
  "ice-stone": "Pierre Glace",
  "kings-rock": "Roche Royale",
  "metal-coat": "Pelage Métal",
  "dragon-scale": "Écaille Dragon",
  "up-grade": "Upgrade",
  "dubious-disc": "Disque Étrange",
  protector: "Protecteur",
  electirizer: "Électriseur",
  magmarizer: "Magmariseur",
  "reaper-cloth": "Tissu Faucheur",
  "prism-scale": "Écaille Prisme",
  "whipped-dream": "Crème de Rêve",
  sachet: "Sachet Parfumé",
  "linking-cord": "Câble Lien",
  "auspicious-armor": "Armure Auspicieuse",
  "malicious-armor": "Armure Malveillante",
};

function toLabel(name: string): string {
  return name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function itemLabel(name: string): string {
  return itemNames[name] ?? toLabel(name);
}

function conditionLabels(conditions: EvolutionConditions[]): string[] {
  return conditions.map((cond) => {
    const parts: string[] = [];
    if (cond.trigger === "trade") {
      if (cond.heldItem) parts.push(`Échange + ${itemLabel(cond.heldItem)}`);
      else if (cond.tradeSpecies)
        parts.push(`Échange avec ${toLabel(cond.tradeSpecies)}`);
      else parts.push("Échange");
    } else if (cond.trigger === "use-item" && cond.item) {
      parts.push(itemLabel(cond.item));
    } else {
      if (cond.minLevel) parts.push(`Niv. ${cond.minLevel}`);
      if (cond.minHappiness) parts.push(`Bonheur ≥ ${cond.minHappiness}`);
      if (cond.minBeauty) parts.push(`Beauté ≥ ${cond.minBeauty}`);
      if (cond.minAffection) parts.push(`Affection ≥ ${cond.minAffection}`);
      if (cond.heldItem) parts.push(`Tenir : ${itemLabel(cond.heldItem)}`);
      if (cond.item) parts.push(itemLabel(cond.item));
      if (cond.timeOfDay === "day") parts.push("Jour");
      if (cond.timeOfDay === "night") parts.push("Nuit");
      if (cond.timeOfDay === "dusk") parts.push("Crépuscule");
      if (cond.knownMove) parts.push(`Connaît ${toLabel(cond.knownMove)}`);
      if (cond.knownMoveType) parts.push(`Type ${cond.knownMoveType}`);
      if (cond.location) parts.push(toLabel(cond.location));
      if (cond.needsRain) parts.push("Sous la pluie");
      if (cond.turnUpsideDown) parts.push("Console retournée");
    }
    return parts.join(" · ") || "Montée de niveau";
  });
}
</script>

<template>
  <div>
    <h2 class="text-lg font-bold text-gray-700 mb-4">Évolutions</h2>

    <p v-if="!hasEvolutions" class="text-sm text-gray-500 italic">
      Ce Pokémon n'évolue pas.
    </p>

    <div v-else class="overflow-x-auto py-2">
      <div class="flex items-center justify-center min-w-full">
        <template v-for="(level, levelIdx) in levels" :key="levelIdx">
          <div class="flex flex-col gap-3 justify-center">
            <div
              v-for="stage in level"
              :key="stage.pokemon.id"
              class="flex items-center"
            >
              <UiEvolutionArrow
                v-if="levelIdx > 0"
                :labels="conditionLabels(stage.conditions)"
              />

              <NuxtLink
                :to="`/pokemon/${stage.pokemon.id}`"
                class="flex flex-col items-center gap-1 p-2 rounded-xl transition w-24"
                :class="
                  stage.pokemon.id === currentId
                    ? 'bg-gray-50 ring-2 ring-primary'
                    : 'bg-gray-50 hover:bg-gray-100'
                "
              >
                <img
                  :src="stage.pokemon.image"
                  :alt="stage.pokemon.name"
                  class="w-16 h-16 object-contain"
                />
                <span class="text-xs text-gray-400">
                  #{{ String(stage.pokemon.id).padStart(3, "0") }}
                </span>
                <span
                  class="text-xs font-semibold text-gray-700 capitalize text-center leading-tight"
                >
                  {{ stage.pokemon.name }}
                </span>
              </NuxtLink>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

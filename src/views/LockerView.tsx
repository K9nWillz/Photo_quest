import React, { useState } from 'react';
import { UserProfile, EquipmentId } from '../types';
import { Avatar, EQUIPMENT_ITEMS } from '../components/avatars';
import { CoinIcon, GemIcon, LockIcon, PackageIcon, SparklesIcon, ShieldIcon } from '../components/icons';
import { triggerHaptic } from '../utils/audio';

interface LockerViewProps {
  profile: UserProfile;
  onEquipItem: (id: EquipmentId) => void;
  onBuyItem: (id: EquipmentId, cost: number) => void;
  onOpenGemVault: () => void;
}

export const LockerView: React.FC<LockerViewProps> = ({
  profile,
  onEquipItem,
  onBuyItem,
  onOpenGemVault,
}) => {
  const [tierFilter, setTierFilter] = useState<'All' | 'Common' | 'Rare' | 'Epic' | 'Legendary'>('All');

  const filteredItems = EQUIPMENT_ITEMS.filter(
    (item) => tierFilter === 'All' || item.tier === tierFilter
  );

  return (
    <div className="px-4 sm:px-8 py-6 max-w-5xl mx-auto space-y-6 pb-28 select-none transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono tracking-widest uppercase text-amber-500 font-bold">
            Tactical Armory
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-main font-normal">Equipment & Gear</h1>
        </div>

        {/* Currency Bar & Gem Vault Button */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-2 font-mono text-sm font-bold text-amber-500">
            <CoinIcon size={16} />
            <span>{profile.coins} Coins</span>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic(10, profile.hapticsEnabled);
              onOpenGemVault();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center gap-2 font-mono text-sm font-bold text-sky-400 hover:bg-sky-500/25 transition-all shadow-sm"
          >
            <GemIcon size={15} />
            <span>{profile.gems} Gems (Vault)</span>
          </button>
        </div>
      </div>

      {/* Live Avatar Preview Fitting Stage */}
      <div className="p-6 rounded-3xl bg-card border border-theme shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Avatar
            type={profile.avatar}
            equippedItem={profile.equippedItem}
            showAccountRing
            size={88}
            showHalo
            className="shadow-xl"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-main">{profile.displayName}</h3>
              <span className="px-2 py-0.5 rounded-md bg-account text-account border border-account text-[10px] font-mono font-bold">
                OPERATOR FITTING
              </span>
            </div>
            <p className="text-xs text-sub mt-1">
              Currently equipped: <strong className="text-main font-mono capitalize">{profile.equippedItem}</strong>
            </p>
            <p className="text-[11px] text-dim mt-0.5">
              Owned Gear: {profile.ownedEquipment.filter((x) => x !== 'none').length} of {EQUIPMENT_ITEMS.length} pieces
            </p>
          </div>
        </div>

        {/* Gem Boost Status Indicator */}
        {profile.boosters.hasStreakShield && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/25 text-sky-400 text-xs font-mono">
            <ShieldIcon size={16} />
            <span>Streak Shield Armed</span>
          </div>
        )}
      </div>

      {/* Tier Filter Tabs */}
      <div className="flex items-center justify-between border-b border-theme pb-2">
        <div className="flex flex-wrap gap-1 text-xs font-mono">
          {(['All', 'Common', 'Rare', 'Epic', 'Legendary'] as const).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => {
                triggerHaptic(10, profile.hapticsEnabled);
                setTierFilter(tier);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                tierFilter === tier
                  ? 'bg-main text-app font-bold shadow-sm'
                  : 'text-sub hover:text-main bg-card-subtle'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Grid (14 Items, Responsive PC & Mobile) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {filteredItems.map((item) => {
          const isOwned = profile.ownedEquipment.includes(item.id);
          const isEquipped = profile.equippedItem === item.id;
          const canAfford = profile.coins >= item.cost;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                isEquipped
                  ? 'bg-card border-account ring-2 ring-[#84cc16] shadow-md'
                  : 'bg-card border-theme hover:border-theme-med shadow-sm'
              }`}
            >
              <div>
                {/* Visual Preview on Abstract Avatar */}
                <div className="relative aspect-square rounded-xl bg-card-subtle border border-theme flex items-center justify-center mb-3 overflow-hidden">
                  <Avatar type={profile.avatar} equippedItem={item.id} size={64} />
                  {!isOwned && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                      <LockIcon size={22} className="mb-1 text-zinc-300" />
                      <div className="flex items-center gap-1 font-mono text-xs text-amber-300 font-bold">
                        <CoinIcon size={12} />
                        <span>{item.cost}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tier and Title */}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                      item.tier === 'Legendary'
                        ? 'bg-rose-500/20 text-rose-400'
                        : item.tier === 'Epic'
                        ? 'bg-violet-500/20 text-violet-400'
                        : item.tier === 'Rare'
                        ? 'bg-sky-500/20 text-sky-400'
                        : 'bg-card-subtle text-dim'
                    }`}
                  >
                    {item.tier}
                  </span>
                  {isEquipped && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-account text-account font-bold">
                      EQUIPPED
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-main">{item.name}</h4>
                <p className="text-[11px] text-sub mt-1 line-clamp-2 leading-snug">
                  {item.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-4">
                {isOwned ? (
                  isEquipped ? (
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic(15, profile.hapticsEnabled);
                        onEquipItem('none');
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-card-subtle border border-theme text-sub hover:text-main text-xs font-mono font-medium"
                    >
                      Unequip
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic(15, profile.hapticsEnabled);
                        onEquipItem(item.id);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-account border border-account text-account hover:opacity-90 text-xs font-mono font-bold shadow-sm"
                    >
                      Equip
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    disabled={!canAfford}
                    onClick={() => {
                      if (canAfford) {
                        triggerHaptic(20, profile.hapticsEnabled);
                        onBuyItem(item.id, item.cost);
                      }
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-md'
                        : 'bg-card-subtle border border-theme text-dim cursor-not-allowed'
                    }`}
                  >
                    <CoinIcon size={14} />
                    <span>Buy ({item.cost})</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

--@ enable = true
local json = require('json')
local socket = require('plugins.luasocket')
local utils = require('utils')

local clock = os.clock
function sleep(n)  -- seconds
  local t0 = clock()
  while clock() - t0 <= n do end
end

function map(func, array)
  local new_array = {}
  for i,v in ipairs(array) do
    new_array[i] = func(v)
  end
  return new_array
end

function getStressLevelDescription(stress_level)
  if stress_level >= 500000 then
    return "Miserable"
  elseif stress_level >= 250000 then
    return "Very Unhappy"
  elseif stress_level >= 100000 then
    return  "Unhappy"
  elseif stress_level == 0 then
    return "Nutral"
  elseif stress_level >= -100000 then
    return "Fine"
  elseif stress_level >= -250000 then
    return "Very Happy"
  elseif stress_level >= -500000 then
    return "Ecstatic"
  end
end

function get_skills(unit,learned_only)
  local s_=df.job_skill
  local u_skills=unit.status.current_soul.skills
  local ret={}
  for i,v in ipairs(s_) do
    if i>0 then
      local u_skill=utils.binsearch(u_skills,i,"id")
      if u_skill or not learned_only then
        if not u_skill then
          u_skill={rating=-1,experience=0}
        end

        local rating
        if u_skill.rating >=0 then
          rating=df.skill_rating.attrs[u_skill.rating]
        else
          rating={caption="No Skill",xp_threshold=0}
        end

        local skill = {
          name = df.job_skill.attrs[i].caption,
          ratingCaption = rating.caption,
          ratingValue = u_skill.rating,
          xp = u_skill.experience,
          maxXp = rating.xp_threshold
        }

        table.insert(ret, skill)
      end
    end
  end
  return ret
end

function get_subtype(item)
  local subtype = ""
  pcall(function()
    subtype = item.subtype.id
  end)
  return subtype;
end

function getUnits()
  local units = {}
  local count = 1
  for i,unit in ipairs(df.global.world.units.all) do
    if dfhack.units.isCitizen(unit) and dfhack.units.isDwarf(unit) then
      -- print(type(unit.inventory[0].item))
      units[count] = {
        name = dfhack.TranslateName(dfhack.units.getVisibleName(unit)),
        profession = dfhack.units.getProfessionName(unit),
        -- civ = dfhack.TranslateName(df.historical_entity.find(unit.civ_id).name),
        stressLevel = getStressLevelDescription(unit.status.current_soul.personality.stress_level),
        skills = get_skills(unit, true),
        currentJob = ( unit.job.current_job ~= nil and dfhack.job.getName(unit.job.current_job) or "No Job" ),
        inventory = map(function(inventory_item)
          local item = inventory_item.item
          return {
            name = dfhack.items.getDescription(item, 0),
            stackSize = item.stack_size,
            subtype = get_subtype(item)
          }
        end, unit.inventory),
        buildings = map(function(building)
          return {
            name = utils.getBuildingName(building)
          }
        end, unit.owned_buildings),
      }
      count = count + 1
    end
  end
  return units
end

local json_units = json.encode(getUnits(), {pretty= false})
local file = io.open("units.json", "w")
io.output(file)
io.write(json_units)
io.close(file)

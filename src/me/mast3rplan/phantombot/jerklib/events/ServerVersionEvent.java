/* 
 * Copyright (C) 2015 www.phantombot.net
 *
 * Credits: mast3rplan, gmt2001, PhantomIndex, GloriousEggroll
 * gloriouseggroll@gmail.com, phantomindex@gmail.com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */
package me.mast3rplan.phantombot.jerklib.events;

import me.mast3rplan.phantombot.jerklib.Session;

/**
 * Event fired for server version information
 *
 * @author mohadib
 */
public class ServerVersionEvent extends IRCEvent
{

    private final String comment, hostName, version, debugLevel;

    public ServerVersionEvent(
            String comment,
            String hostName,
            String version,
            String debugLevel,
            String rawEventData,
            Session session)
    {
        super(rawEventData, session, Type.SERVER_VERSION_EVENT);
        this.comment = comment;
        this.hostName = hostName;
        this.version = version;
        this.debugLevel = debugLevel;
    }

    /**
     * Gets the server version comment
     *
     * @return comment
     */
    public String getComment()
    {
        return comment;
    }

    /**
     * Gets the host name
     *
     * @return hostname
     */
    public String getHostName()
    {
        return hostName;
    }

    /**
     * Gets the version string the server sent
     *
     * @return version string
     */
    public String getVersion()
    {
        return version;
    }

    /**
     * Not impled
     *
     * @return Not impled
     */
    public String getdebugLevel()
    {
        return debugLevel;
    }
}
